import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// Quote request schema
const quoteSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().optional(),
  shop_name: z.string().optional(),
  shop_address: z.string().min(1),
  shop_latitude: z.number(),
  shop_longitude: z.number(),
  machine_type: z.string().optional(),
  issue_description: z.string().min(1),
  preferred_date: z.string().optional(),
  travel_distance: z.number().optional(),
});

// Submit quote request
app.post("/api/quotes", zValidator("json", quoteSchema), async (c) => {
  const data = c.req.valid("json");
  
  // Calculate estimated cost based on travel distance
  const baseCost = 75; // Base service call fee
  const perMileCost = 2.5;
  const estimatedCost = baseCost + (data.travel_distance || 0) * perMileCost;
  
  const result = await c.env.DB.prepare(
    `INSERT INTO quotes (
      customer_name, customer_email, customer_phone, shop_name, shop_address,
      shop_latitude, shop_longitude, machine_type, issue_description,
      preferred_date, travel_distance, estimated_cost, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  )
    .bind(
      data.customer_name,
      data.customer_email,
      data.customer_phone || null,
      data.shop_name || null,
      data.shop_address,
      data.shop_latitude,
      data.shop_longitude,
      data.machine_type || null,
      data.issue_description,
      data.preferred_date || null,
      data.travel_distance || null,
      estimatedCost
    )
    .run();

  return c.json({ 
    success: true, 
    quote_id: result.meta.last_row_id,
    estimated_cost: estimatedCost 
  });
});

// Get gallery images
app.get("/api/gallery", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC"
  ).all();

  return c.json(result.results || []);
});

// Upload gallery image
app.post("/api/gallery/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  if (!file) {
    return c.json({ error: "No file provided" }, 400);
  }

  // Generate unique key for the image
  const timestamp = Date.now();
  const key = `gallery/${timestamp}-${file.name}`;

  // Upload to R2
  await c.env.R2_BUCKET.put(key, file, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  // Save metadata to database
  const result = await c.env.DB.prepare(
    `INSERT INTO gallery_images (title, description, image_key) VALUES (?, ?, ?)`
  )
    .bind(title || null, description || null, key)
    .run();

  return c.json({ 
    success: true, 
    image_id: result.meta.last_row_id 
  });
});

// Get image from R2
app.get("/api/gallery/image/*", async (c) => {
  const key = c.req.path.replace("/api/gallery/image/", "");
  const object = await c.env.R2_BUCKET.get(key);
  
  if (!object) {
    return c.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000");
  
  return c.body(object.body, { headers });
});

// Delete gallery image
app.delete("/api/gallery/:id", async (c) => {
  const id = c.req.param("id");
  
  // Get image key first
  const image = await c.env.DB.prepare(
    "SELECT image_key FROM gallery_images WHERE id = ?"
  )
    .bind(id)
    .first();

  if (!image) {
    return c.notFound();
  }

  // Delete from R2
  await c.env.R2_BUCKET.delete(image.image_key as string);

  // Delete from database
  await c.env.DB.prepare("DELETE FROM gallery_images WHERE id = ?")
    .bind(id)
    .run();

  return c.json({ success: true });
});

// Get app settings
app.get("/api/settings", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT setting_key, setting_value FROM app_settings"
  ).all();

  const settings: Record<string, string> = {};
  for (const row of result.results || []) {
    settings[row.setting_key as string] = row.setting_value as string;
  }

  return c.json(settings);
});

// Update app settings
const settingsSchema = z.object({
  years_experience: z.string().min(1),
  machines_serviced: z.string().min(1),
  emergency_support: z.string().min(1),
  footer_phone: z.string().optional(),
  footer_email: z.string().optional(),
  footer_address: z.string().optional(),
  footer_hours_weekday: z.string().optional(),
  footer_hours_saturday: z.string().optional(),
  footer_hours_sunday: z.string().optional(),
  social_facebook: z.string().optional(),
  social_instagram: z.string().optional(),
});

app.put("/api/settings", zValidator("json", settingsSchema), async (c) => {
  const data = c.req.valid("json");

  // Update each setting
  for (const [key, value] of Object.entries(data)) {
    await c.env.DB.prepare(
      `UPDATE app_settings 
       SET setting_value = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE setting_key = ?`
    )
      .bind(value, key)
      .run();
  }

  return c.json({ success: true });
});

// Reverse geocode endpoint to handle mobile CORS issues
app.get("/api/reverse-geocode", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");

  if (!lat || !lon) {
    return c.json({ error: "Missing lat or lon parameters" }, 400);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "ExoCoffee-Web",
        },
      }
    );

    const data = await response.json() as any;
    
    if (data.address) {
      const address = data.address;
      const formattedAddress = `${address.house_number || ''} ${address.road || ''}, ${address.suburb || address.town || address.city || ''}, ${address.state || ''}, ${address.postcode || ''}`.trim().replace(/^[\s,]+|[\s,]+$/g, '');
      return c.json({ address: formattedAddress });
    }

    return c.json({ address: "" });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return c.json({ error: "Failed to reverse geocode" }, 500);
  }
});

export default app;
