import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- Mongo (cached) ----------
let _clientPromise = null;
function getClient() {
  if (!_clientPromise) {
    const uri = process.env.MONGO_URL;
    _clientPromise = new MongoClient(uri, { maxPoolSize: 10 }).connect();
  }
  return _clientPromise;
}
async function db() {
  const client = await getClient();
  return client.db(process.env.DB_NAME || 'sanatana');
}

// ---------- LLM helper ----------
const LLM_URL = (process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm/v1') + '/chat/completions';
const LLM_KEY = process.env.EMERGENT_LLM_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'claude-sonnet-4-5-20250929';

async function callLLM(messages, { max_tokens = 1400, temperature = 0.7, model } = {}) {
  const res = await fetch(LLM_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${LLM_KEY}`,
    },
    body: JSON.stringify({
      model: model || LLM_MODEL,
      messages,
      max_tokens,
      temperature,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error ${res.status}: ${text}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content || '';
  return content;
}

// ---------- Static content ----------
const DAILY_QUOTES = [
  { text: 'You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.', source: 'Brihadaranyaka Upanishad' },
  { text: 'The mind is everything. What you think, you become.', source: 'Attributed to the Buddha' },
  { text: 'Peace comes from within. Do not seek it without.', source: 'Buddhist teaching' },
  { text: 'You have the right to work, but never to the fruit of work.', source: 'Bhagavad Gita 2.47' },
  { text: 'The wound is the place where the Light enters you.', source: 'Rumi' },
  { text: 'Watch your thoughts, for they become words. Watch your words, for they become actions.', source: 'Ancient wisdom' },
  { text: 'Yoga is the journey of the self, through the self, to the self.', source: 'Bhagavad Gita 6.20' },
  { text: 'Knowing yourself is the beginning of all wisdom.', source: 'Aristotle' },
  { text: 'The universe is not outside of you. Look inside yourself; everything that you want, you already are.', source: 'Rumi' },
  { text: 'Silence is the language of god, all else is poor translation.', source: 'Rumi' },
];

const FEATURED_TEMPLES = [
  {
    id: 'kedarnath',
    name: 'Kedarnath Temple',
    location: 'Uttarakhand, India',
    deity: 'Shiva',
    era: 'c. 8th century CE (rebuilt by Adi Shankaracharya)',
    image: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?auto=format&fit=crop&w=1400&q=80',
    history: 'One of the twelve Jyotirlingas of Shiva, perched at 3,583 m in the Garhwal Himalayas. Legend holds it was built by the Pandavas and revived by Adi Shankaracharya in the 8th century.',
    architecture: 'Built from massive interlocking grey stone slabs without mortar — an engineering feat that has survived nearly a millennium of Himalayan weather, earthquakes and the 2013 flood.',
    mystery: 'During the 2013 Kedarnath floods a large boulder (the ‘Bhim Shila’) diverted debris around the temple, leaving it structurally intact while the surrounding town was destroyed.',
    science: 'The dry-stone masonry acts as a flexible seismic damper. Recent geological surveys confirm the site sits on a natural rock terrace that deflects glacial melt-water.',
    timings: '4:00 AM – 9:00 PM (May–Nov, closed in winter)',
  },
  {
    id: 'angkor',
    name: 'Angkor Wat',
    location: 'Siem Reap, Cambodia',
    deity: 'Originally Vishnu, later Buddhist',
    era: '12th century CE',
    image: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?auto=format&fit=crop&w=1400&q=80',
    history: 'Built by Khmer king Suryavarman II in the early 12th century as a Hindu temple dedicated to Vishnu, later transformed into a Buddhist site. The largest religious monument in the world.',
    architecture: 'A precise miniature of the Hindu cosmos: Mount Meru at the center, surrounded by continents and cosmic oceans (the moat). Aligned to solstice sunrises.',
    mystery: 'On the spring equinox, the sun rises directly over the central tower, an alignment discovered only in the 20th century.',
    science: 'LiDAR surveys (2012+) revealed a vast hidden urban grid around Angkor — one of the largest pre-industrial cities on Earth, with sophisticated hydraulic engineering.',
    timings: '5:00 AM – 5:30 PM',
  },
];

const MASTERS = {
  krishna: {
    name: 'Krishna',
    tradition: 'Bhagavad Gita / Hindu',
    voice: 'You speak in the voice of an AI persona inspired by the teachings of Krishna as recorded in the Bhagavad Gita and Bhagavata Purana. You are wise, playful, compassionate, and often reference dharma, karma, yoga of action, and devotion. Use short, luminous sentences. When helpful, cite Gita chapter and verse. Never claim to be the actual historical/divine Krishna — you are an interpretation.',
  },
  buddha: {
    name: 'Buddha',
    tradition: 'Buddhism (Pali/Mahayana traditions)',
    voice: 'You speak in the voice of an AI persona inspired by the recorded teachings of Siddhartha Gautama, the Buddha. You are calm, precise, and non-attached. You emphasize the Four Noble Truths, dependent origination, mindfulness, and compassion. Use gentle direct language. Never claim to be the actual Buddha.',
  },
  jesus: {
    name: 'Jesus',
    tradition: 'Christianity',
    voice: 'You speak in the voice of an AI persona inspired by the recorded teachings of Jesus of Nazareth in the Gospels. You are compassionate, use parables, and speak of unconditional love, forgiveness, and the kingdom within. Cite Gospel verses where relevant. Never claim to be the actual historical Jesus.',
  },
  rumi: {
    name: 'Rumi',
    tradition: 'Sufi Islam',
    voice: 'You speak in the voice of an AI persona inspired by the poetry of Jalaluddin Rumi. You are poetic, mystical, warm, using metaphors of the beloved, the reed flute, wine, and the heart. Occasionally quote Rumi couplets. Never claim to be the actual Rumi.',
  },
  vivekananda: {
    name: 'Swami Vivekananda',
    tradition: 'Vedanta / Modern Hinduism',
    voice: 'You speak in the voice of an AI persona inspired by Swami Vivekananda. Direct, bold, empowering. You emphasize strength, service, universal religion, and the divinity within every soul. Cite Vivekananda where useful.',
  },
  ramana: {
    name: 'Ramana Maharshi',
    tradition: 'Advaita Vedanta',
    voice: 'You speak in the voice of an AI persona inspired by Ramana Maharshi. You reply with silence-flavored simplicity, always redirecting the seeker to the question "Who am I?" and the direct experience of the Self.',
  },
};

const COMPARE_TOPICS = ['God', 'Soul', 'Afterlife', 'Karma', 'Meditation', 'Compassion'];
const COMPARE_TABLE = {
  God: {
    Hinduism: 'One Brahman appearing as many forms (Vishnu, Shiva, Devi, etc.); both personal and impersonal.',
    Buddhism: 'No creator-god required for liberation; some schools accept devas, but nirvana is central.',
    Christianity: 'One personal God in three persons (Father, Son, Holy Spirit).',
    Islam: 'One transcendent God (Allah), absolutely one (tawhid), with 99 names.',
    Judaism: 'One God (YHWH), covenantal relationship with humanity.',
    Sikhism: 'One formless God (Ik Onkar), beyond gender or image.',
  },
  Soul: {
    Hinduism: 'Atman — eternal, ultimately identical with Brahman (Advaita) or distinct-yet-dependent (Dvaita).',
    Buddhism: 'Anatta — no permanent self; a stream of dependently-arising processes.',
    Christianity: 'Immortal soul created by God; united with body at resurrection.',
    Islam: 'Ruh — breathed into the body by God; judged after death.',
    Judaism: 'Neshamah — divine breath; multiple layers in Kabbalah.',
    Sikhism: 'Soul is a spark of the Divine, returning through cycles until union.',
  },
  Afterlife: {
    Hinduism: 'Rebirth guided by karma; ultimate goal is moksha — release from the cycle.',
    Buddhism: 'Rebirth in six realms; nirvana ends the cycle.',
    Christianity: 'Heaven, hell, purgatory (Catholic); resurrection of the dead.',
    Islam: 'Barzakh (waiting), then Day of Judgment, Jannah (heaven) or Jahannam (hell).',
    Judaism: 'Olam Ha-Ba (world to come); varied views on resurrection and Sheol.',
    Sikhism: 'Cycle of rebirth until merger with the Divine.',
  },
  Karma: {
    Hinduism: 'Every action produces seeds that fruit in this or future lives.',
    Buddhism: 'Intentional actions shape future experience; not deterministic fate.',
    Christianity: 'Not a formal doctrine; "you reap what you sow" is a moral parallel.',
    Islam: 'Each deed is recorded; final judgment weighs them.',
    Judaism: 'Middah k-neged middah — measure for measure; some mystical rebirth (gilgul).',
    Sikhism: 'Karma governs the cycle; grace (nadar) can liberate.',
  },
  Meditation: {
    Hinduism: 'Dhyana — many forms: mantra, breath, deity-focus, self-inquiry.',
    Buddhism: 'Samatha (calm) and vipassana (insight); mindfulness of body, feelings, mind, phenomena.',
    Christianity: 'Contemplative prayer, lectio divina, hesychasm (Jesus Prayer).',
    Islam: 'Dhikr — remembrance of God through repetition of divine names; muraqaba.',
    Judaism: 'Hitbodedut (secluded prayer/conversation); Kabbalistic meditations.',
    Sikhism: 'Naam Simran — remembrance of the Divine Name, often in sangat.',
  },
  Compassion: {
    Hinduism: 'Karuna and ahimsa — non-harm as highest dharma.',
    Buddhism: 'Karuna is one of the four brahmaviharas; a bodhisattva vows to relieve all suffering.',
    Christianity: 'Agape — self-giving love; "love your neighbor as yourself".',
    Islam: '"In the name of God, the Compassionate, the Merciful" — rahma opens every chapter.',
    Judaism: 'Chesed — loving-kindness; tikkun olam, repair of the world.',
    Sikhism: 'Seva — selfless service to all humanity.',
  },
};

// ---------- Route handler ----------
async function readBody(request) {
  try { return await request.json(); } catch { return {}; }
}

async function handler(request, context) {
  const params = await context.params;
  const path = (params?.path || []).join('/');
  const method = request.method;

  try {
    // GET /api/  -> hello
    if (method === 'GET' && (path === '' || path === '/')) {
      return NextResponse.json({ message: 'Sanatana API alive', model: LLM_MODEL });
    }

    // GET /api/daily  -> deterministic quote for today
    if (method === 'GET' && path === 'daily') {
      const d = new Date();
      const dayIdx = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000);
      const q = DAILY_QUOTES[dayIdx % DAILY_QUOTES.length];
      const temple = FEATURED_TEMPLES[dayIdx % FEATURED_TEMPLES.length];
      return NextResponse.json({ quote: q, temple, date: d.toISOString().slice(0, 10) });
    }

    // GET /api/masters -> list of masters
    if (method === 'GET' && path === 'masters') {
      const list = Object.entries(MASTERS).map(([id, m]) => ({ id, name: m.name, tradition: m.tradition }));
      return NextResponse.json({ masters: list });
    }

    // GET /api/compare -> comparison table
    if (method === 'GET' && path === 'compare') {
      return NextResponse.json({ topics: COMPARE_TOPICS, table: COMPARE_TABLE });
    }

    // POST /api/guru -> 4-perspective answer
    if (method === 'POST' && path === 'guru') {
      const { question } = await readBody(request);
      if (!question || question.trim().length < 3) {
        return NextResponse.json({ error: 'question required' }, { status: 400 });
      }
      const system = `You are the Sanatana Spiritual Guru — a scholar, scientist, philosopher, and contemplative all in one.

When given a life/spiritual/philosophical question, you MUST return a STRICT JSON object with these exact keys:
{
  "question": "...the original question...",
  "scientific": "...how modern science (physics, neuroscience, psychology, biology, cosmology) addresses this. Cite disciplines. Be honest about what is well-established vs speculative. 4-7 sentences.",
  "spiritual": "...how the major spiritual traditions (Hindu, Buddhist, Christian, Islamic/Sufi, Taoist as relevant) address this. Reference specific texts/teachers where useful. Present multiple traditions, not one. 4-7 sentences.",
  "philosophical": "...how philosophers (Eastern and Western) have addressed this — Advaita, Stoicism, phenomenology, analytic philosophy of mind, etc. Name thinkers. 4-7 sentences.",
  "historical": "...how humans across history and cultures have understood this — anthropology, comparative religion, historical shifts. 3-6 sentences.",
  "synthesis": "...a brief, humble bridge that honors all four views without collapsing them. 2-4 sentences. Never claim one perspective is \"the\" truth.",
  "reflection": "...one contemplative question the reader can sit with today. One sentence."
}

Rules:
- Output ONLY the JSON object. No markdown, no code fences, no preface.
- Be balanced, respectful, and clearly distinguish scientific evidence from tradition/speculation.
- Do NOT make up quotes or verses; if unsure, describe the teaching in your own words.
- Keep prose warm, elegant, and readable by a curious teenager.`;
      const raw = await callLLM([
        { role: 'system', content: system },
        { role: 'user', content: question.trim() },
      ], { max_tokens: 1800, temperature: 0.7 });

      let parsed;
      try {
        const jsonStart = raw.indexOf('{');
        const jsonEnd = raw.lastIndexOf('}');
        parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      } catch (e) {
        parsed = { question, scientific: raw, spiritual: '', philosophical: '', historical: '', synthesis: '', reflection: '' };
      }

      // persist
      try {
        const database = await db();
        await database.collection('guru_answers').insertOne({
          id: uuidv4(),
          question,
          answer: parsed,
          createdAt: new Date(),
        });
      } catch (e) { /* non-fatal */ }

      return NextResponse.json({ ...parsed });
    }

    // POST /api/master -> chat with a master persona
    if (method === 'POST' && path === 'master') {
      const { master_id, session_id, message, history = [] } = await readBody(request);
      const master = MASTERS[master_id];
      if (!master) return NextResponse.json({ error: 'unknown master_id' }, { status: 400 });
      if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });
      const sid = session_id || uuidv4();

      const system = master.voice + '\n\nIMPORTANT: You are an AI interpretation, not the historical person. Keep responses to 3-6 short paragraphs. Address the seeker warmly. Occasionally include a short quotation or verse if genuinely relevant.';
      const msgs = [{ role: 'system', content: system }];
      for (const h of history.slice(-8)) {
        if (h.role === 'user' || h.role === 'assistant') {
          msgs.push({ role: h.role, content: String(h.content || '').slice(0, 4000) });
        }
      }
      msgs.push({ role: 'user', content: String(message).slice(0, 4000) });

      const reply = await callLLM(msgs, { max_tokens: 900, temperature: 0.85 });

      try {
        const database = await db();
        await database.collection('master_chats').insertOne({
          id: uuidv4(), session_id: sid, master_id, message, reply, createdAt: new Date(),
        });
      } catch (e) { /* non-fatal */ }

      return NextResponse.json({ session_id: sid, reply, master: { id: master_id, name: master.name, tradition: master.tradition } });
    }

    return NextResponse.json({ error: 'not found', path }, { status: 404 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
