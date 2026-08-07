
const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: "Missing Supabase env vars" });

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const body = req.body || {};

  const nickname = String(body.nickname || "匿名").slice(0, 80);
  const note = String(body.note || "").slice(0, 300);
  const answers = Array.isArray(body.answers) ? body.answers : [];
  const scores = body.pct || {};
  const compatibility = Number(body.compatibility || 0);
  const personality_type = String(body.type || "未分類").slice(0, 50);

  if (answers.length !== 20) return res.status(400).json({ error: "Invalid answers" });

  const { error } = await supabase.from("quiz_submissions").insert({
    nickname, note, answers, scores, compatibility, personality_type
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
};
