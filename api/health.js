const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminKey = process.env.ADMIN_KEY;

    const result = {
      supabaseUrlExists: !!url,
      supabaseKeyExists: !!key,
      adminKeyExists: !!adminKey,

      // 只顯示格式，不顯示真正內容
      supabaseUrlStartsWithHttps: url ? url.startsWith("https://") : false,
      supabaseUrlEndsWithSupabaseCo: url ? url.includes(".supabase.co") : false,

      keyPrefix: key
        ? key.startsWith("sb_secret_")
          ? "sb_secret"
          : key.startsWith("eyJ")
          ? "jwt/service_role"
          : "unknown"
        : "missing"
    };

    try {
      createClient(url, key, {
        auth: { persistSession: false }
      });

      result.createClient = "success";
    } catch (error) {
      result.createClient = "failed";
      result.createClientError = error.message;
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      stage: "health endpoint",
      error: error.message
    });
  }
};