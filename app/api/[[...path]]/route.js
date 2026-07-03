import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { WHY_CARDS, MALA, DEEKSHA, PUJA_VIDHANAM, COSMIC_TIMELINE, MEDITATIONS, SACRED_BOOKS, BODY_MAP, CHAKRA_QUIZ } from '@/lib/content';
import { LIFE_QUESTIONS, WORLD_TEMPLES, SACRED_MUSIC } from '@/lib/content-extra';
import { ANCIENT_KNOWLEDGE, LEARNING_PATHS, DAILY_PRACTICES, CHALLENGES, MYSTERIES } from '@/lib/content-more';
import { MORE_LIFE_QUESTIONS, MORE_TEMPLES, MORE_BOOKS, MORE_MEDITATIONS } from '@/lib/content-expand';
import { COACH_DOMAINS, YAJNA, UNIVERSE_SCALES } from '@/lib/content-final';
import { CHAKRA_OPENING, VEDIC_BODY_COSMOS, MORE_TEMPLES_V2 } from '@/lib/content-v2';

// Merge expansions
const ALL_QUESTIONS = [...LIFE_QUESTIONS, ...MORE_LIFE_QUESTIONS];
const ALL_TEMPLES = [...WORLD_TEMPLES, ...MORE_TEMPLES, ...MORE_TEMPLES_V2];
const ALL_BOOKS = [...SACRED_BOOKS, ...MORE_BOOKS];
const ALL_MEDITATIONS = [...MEDITATIONS, ...MORE_MEDITATIONS];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- Mongo ----------
let _clientPromise = null;
function getClient() {
  if (!_clientPromise) _clientPromise = new MongoClient(process.env.MONGO_URL, { maxPoolSize: 10 }).connect();
  return _clientPromise;
}
async function db() { return (await getClient()).db(process.env.DB_NAME || 'sanatana'); }

// ---------- LLM ----------
const LLM_URL = (process.env.EMERGENT_LLM_BASE_URL || 'https://integrations.emergentagent.com/llm/v1') + '/chat/completions';
const LLM_KEY = process.env.EMERGENT_LLM_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'claude-sonnet-4-5-20250929';

async function callLLM(messages, { max_tokens = 1400, temperature = 0.7 } = {}) {
  const res = await fetch(LLM_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${LLM_KEY}` },
    body: JSON.stringify({ model: LLM_MODEL, messages, max_tokens, temperature }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content || '';
}

// ---------- Static data ----------
const DAILY_QUOTES = [
  { text: 'You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.', source: 'Brihadaranyaka Upanishad' },
  { text: 'The mind is everything. What you think, you become.', source: 'Attributed to the Buddha' },
  { text: 'Peace comes from within. Do not seek it without.', source: 'Buddhist teaching' },
  { text: 'You have the right to work, but never to the fruit of work.', source: 'Bhagavad Gita 2.47' },
  { text: 'The wound is the place where the Light enters you.', source: 'Rumi' },
  { text: 'Yoga is the journey of the self, through the self, to the self.', source: 'Bhagavad Gita 6.20' },
  { text: 'Knowing yourself is the beginning of all wisdom.', source: 'Aristotle' },
  { text: 'The universe is not outside of you. Look inside yourself; everything that you want, you already are.', source: 'Rumi' },
  { text: 'Silence is the language of god, all else is poor translation.', source: 'Rumi' },
  { text: 'When you know yourself, you will know the universe and the gods.', source: 'Delphic maxim' },
];

const FEATURED_TEMPLES = [
  { id: 'kedarnath', name: 'Kedarnath Temple', location: 'Uttarakhand, India', deity: 'Shiva', era: 'c. 8th century CE (rebuilt by Adi Shankaracharya)',
    image: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?auto=format&fit=crop&w=1400&q=80',
    history: 'One of the twelve Jyotirlingas of Shiva, perched at 3,583 m in the Garhwal Himalayas. Legend holds it was built by the Pandavas and revived by Adi Shankaracharya in the 8th century.',
    architecture: 'Built from massive interlocking grey stone slabs without mortar — an engineering feat that has survived nearly a millennium of Himalayan weather, earthquakes and the 2013 flood.',
    mystery: 'During the 2013 Kedarnath floods a large boulder (the \u2018Bhim Shila\u2019) diverted debris around the temple, leaving it structurally intact while the surrounding town was destroyed.',
    science: 'The dry-stone masonry acts as a flexible seismic damper. Recent geological surveys confirm the site sits on a natural rock terrace that deflects glacial melt-water.',
    timings: '4:00 AM \u2013 9:00 PM (May\u2013Nov)' },
  { id: 'angkor', name: 'Angkor Wat', location: 'Siem Reap, Cambodia', deity: 'Originally Vishnu, later Buddhist', era: '12th century CE',
    image: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?auto=format&fit=crop&w=1400&q=80',
    history: 'Built by Khmer king Suryavarman II in the early 12th century as a Hindu temple dedicated to Vishnu, later transformed into a Buddhist site. The largest religious monument in the world.',
    architecture: 'A precise miniature of the Hindu cosmos: Mount Meru at the center, surrounded by continents and cosmic oceans (the moat). Aligned to solstice sunrises.',
    mystery: 'On the spring equinox, the sun rises directly over the central tower, an alignment discovered only in the 20th century.',
    science: 'LiDAR surveys (2012+) revealed a vast hidden urban grid around Angkor \u2014 one of the largest pre-industrial cities on Earth, with sophisticated hydraulic engineering.',
    timings: '5:00 AM \u2013 5:30 PM' },
];

const MASTERS = {
  krishna: { name: 'Krishna', tradition: 'Bhagavad Gita / Hindu', voice: 'You speak in the voice of an AI persona inspired by the teachings of Krishna as recorded in the Bhagavad Gita and Bhagavata Purana. You are wise, playful, compassionate, and often reference dharma, karma, yoga of action, and devotion. Use short, luminous sentences. When helpful, cite Gita chapter and verse. Never claim to be the actual historical/divine Krishna \u2014 you are an interpretation.' },
  buddha: { name: 'Buddha', tradition: 'Buddhism', voice: 'You speak in the voice of an AI persona inspired by the recorded teachings of Siddhartha Gautama, the Buddha. You are calm, precise, and non-attached. You emphasize the Four Noble Truths, dependent origination, mindfulness, and compassion. Never claim to be the actual Buddha.' },
  jesus: { name: 'Jesus', tradition: 'Christianity', voice: 'You speak in the voice of an AI persona inspired by the recorded teachings of Jesus of Nazareth in the Gospels. You are compassionate, use parables, and speak of unconditional love, forgiveness, and the kingdom within. Never claim to be the actual historical Jesus.' },
  rumi: { name: 'Rumi', tradition: 'Sufi Islam', voice: 'You speak in the voice of an AI persona inspired by Rumi. Poetic, mystical, warm, using metaphors of the beloved, the reed flute, the heart. Never claim to be Rumi.' },
  vivekananda: { name: 'Swami Vivekananda', tradition: 'Vedanta', voice: 'You speak as an AI persona inspired by Swami Vivekananda. Direct, bold, empowering. You emphasize strength, service, universal religion, and divinity within.' },
  ramana: { name: 'Ramana Maharshi', tradition: 'Advaita Vedanta', voice: 'You speak as an AI persona inspired by Ramana Maharshi. Silence-flavored simplicity, redirecting the seeker to "Who am I?" and the direct experience of the Self.' },
};

const COMPARE_TOPICS = ['God', 'Soul', 'Afterlife', 'Karma', 'Meditation', 'Compassion'];
const COMPARE_TABLE = {
  God: { Hinduism: 'One Brahman appearing as many forms; both personal and impersonal.', Buddhism: 'No creator-god required for liberation; devas exist but nirvana is central.', Christianity: 'One personal God in three persons (Trinity).', Islam: 'One transcendent God (Allah), absolutely one (tawhid).', Judaism: 'One God (YHWH), covenantal relationship.', Sikhism: 'One formless God (Ik Onkar), beyond gender or image.' },
  Soul: { Hinduism: 'Atman \u2014 eternal, identical with Brahman (Advaita).', Buddhism: 'Anatta \u2014 no permanent self; stream of processes.', Christianity: 'Immortal soul created by God.', Islam: 'Ruh \u2014 breathed into the body by God.', Judaism: 'Neshamah \u2014 divine breath; multiple layers.', Sikhism: 'Soul is a spark of the Divine.' },
  Afterlife: { Hinduism: 'Rebirth by karma; ultimate goal is moksha.', Buddhism: 'Rebirth in six realms; nirvana ends the cycle.', Christianity: 'Heaven, hell, resurrection.', Islam: 'Barzakh, then Day of Judgment, Jannah or Jahannam.', Judaism: 'Olam Ha-Ba; varied views.', Sikhism: 'Cycle of rebirth until merger.' },
  Karma: { Hinduism: 'Every action seeds future life.', Buddhism: 'Intentional actions shape future experience.', Christianity: '"You reap what you sow" — moral parallel.', Islam: 'Every deed recorded for judgment.', Judaism: 'Middah k-neged middah — measure for measure.', Sikhism: 'Karma governs cycle; grace liberates.' },
  Meditation: { Hinduism: 'Dhyana \u2014 mantra, breath, deity-focus, self-inquiry.', Buddhism: 'Samatha and vipassana.', Christianity: 'Contemplative prayer, lectio divina.', Islam: 'Dhikr \u2014 remembrance of God.', Judaism: 'Hitbodedut; Kabbalistic meditations.', Sikhism: 'Naam Simran \u2014 remembrance of the Name.' },
  Compassion: { Hinduism: 'Karuna and ahimsa.', Buddhism: 'Karuna; the bodhisattva vow.', Christianity: 'Agape \u2014 self-giving love.', Islam: 'Rahma \u2014 the compassionate one.', Judaism: 'Chesed \u2014 loving-kindness.', Sikhism: 'Seva \u2014 selfless service.' },
};

// ---------- Handler ----------
async function readBody(request) { try { return await request.json(); } catch { return {}; } }

async function handler(request, context) {
  const params = await context.params;
  const path = (params?.path || []).join('/');
  const method = request.method;

  try {
    if (method === 'GET' && (path === '' || path === '/')) return NextResponse.json({ message: 'Sanatana API', model: LLM_MODEL });

    if (method === 'GET' && path === 'daily') {
      const d = new Date();
      const dayIdx = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000);
      return NextResponse.json({ quote: DAILY_QUOTES[dayIdx % DAILY_QUOTES.length], temple: FEATURED_TEMPLES[dayIdx % FEATURED_TEMPLES.length], date: d.toISOString().slice(0, 10) });
    }

    if (method === 'GET' && path === 'masters') {
      return NextResponse.json({ masters: Object.entries(MASTERS).map(([id, m]) => ({ id, name: m.name, tradition: m.tradition })) });
    }

    if (method === 'GET' && path === 'compare') {
      return NextResponse.json({ topics: COMPARE_TOPICS, table: COMPARE_TABLE });
    }

    // Content endpoints
    if (method === 'GET' && path === 'why') return NextResponse.json({ cards: WHY_CARDS });
    if (method === 'GET' && path === 'practices') return NextResponse.json({ mala: MALA, deeksha: DEEKSHA, puja: PUJA_VIDHANAM });
    if (method === 'GET' && path === 'timeline') return NextResponse.json({ eras: COSMIC_TIMELINE });
    if (method === 'GET' && path === 'meditations') return NextResponse.json({ meditations: ALL_MEDITATIONS });
    if (method === 'GET' && path === 'books') return NextResponse.json({ books: ALL_BOOKS });
    if (method === 'GET' && path === 'body-map') return NextResponse.json({ parts: BODY_MAP });
    if (method === 'GET' && path === 'chakra-quiz') return NextResponse.json({ questions: CHAKRA_QUIZ });
    if (method === 'GET' && path === 'questions') return NextResponse.json({ questions: ALL_QUESTIONS });
    if (method === 'GET' && path === 'temples') return NextResponse.json({ temples: ALL_TEMPLES });
    if (method === 'GET' && path === 'music') return NextResponse.json({ tracks: SACRED_MUSIC });
    if (method === 'GET' && path === 'knowledge') return NextResponse.json({ topics: ANCIENT_KNOWLEDGE });
    if (method === 'GET' && path === 'paths') return NextResponse.json({ paths: LEARNING_PATHS });
    if (method === 'GET' && path === 'daily-practices') return NextResponse.json(DAILY_PRACTICES);
    if (method === 'GET' && path === 'challenges') return NextResponse.json({ challenges: CHALLENGES });
    if (method === 'GET' && path === 'mysteries') return NextResponse.json({ mysteries: MYSTERIES });
    if (method === 'GET' && path === 'coach-domains') return NextResponse.json({ domains: COACH_DOMAINS.map(d => ({ id: d.id, name: d.name, color: d.color, icon: d.icon, tagline: d.tagline })) });
    if (method === 'GET' && path === 'yajna') return NextResponse.json(YAJNA);
    if (method === 'GET' && path === 'universe') return NextResponse.json({ scales: UNIVERSE_SCALES });
    if (method === 'GET' && path === 'chakras') return NextResponse.json({ chakras: CHAKRA_OPENING });
    if (method === 'GET' && path === 'vedic-cosmos') return NextResponse.json(VEDIC_BODY_COSMOS);

    // Community: anonymous public reflections
    if (method === 'GET' && path === 'community') {
      try {
        const items = await (await db()).collection('community_posts').find({}).sort({ createdAt: -1 }).limit(50).toArray();
        return NextResponse.json({ posts: items.map(p => ({ id: p.id, alias: p.alias, topic: p.topic, text: p.text, createdAt: p.createdAt })) });
      } catch { return NextResponse.json({ posts: [] }); }
    }
    if (method === 'POST' && path === 'community') {
      const { alias, topic, text } = await readBody(request);
      if (!text || text.length < 5) return NextResponse.json({ error: 'text required' }, { status: 400 });
      const post = { id: uuidv4(), alias: (alias || 'Seeker').slice(0, 40), topic: (topic || 'reflection').slice(0, 40), text: text.slice(0, 2000), createdAt: new Date() };
      try { await (await db()).collection('community_posts').insertOne(post); } catch {}
      return NextResponse.json({ ok: true, post });
    }

    // AI Life Coach
    if (method === 'POST' && path === 'coach') {
      const { domain_id, message, history = [] } = await readBody(request);
      const d = COACH_DOMAINS.find(x => x.id === domain_id);
      if (!d || !message) return NextResponse.json({ error: 'invalid input' }, { status: 400 });
      const system = d.prompt + '\n\nGuidelines: 3-5 short paragraphs. Warm, direct, actionable. End with ONE specific micro-step for today. Never give medical/legal/financial specifics \u2014 point toward professionals when needed.';
      const msgs = [{ role: 'system', content: system }, ...history.slice(-6).filter(h => ['user', 'assistant'].includes(h.role)).map(h => ({ role: h.role, content: String(h.content).slice(0, 3000) })), { role: 'user', content: String(message).slice(0, 3000) }];
      const reply = await callLLM(msgs, { max_tokens: 900, temperature: 0.75 });
      try { await (await db()).collection('coach_chats').insertOne({ id: uuidv4(), domain_id, message, reply, createdAt: new Date() }); } catch {}
      return NextResponse.json({ reply, domain: { id: d.id, name: d.name } });
    }

    if (method === 'POST' && path === 'guru') {
      const { question } = await readBody(request);
      if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 });
      const system = `You are the Sanatana Spiritual Guru. Return STRICT JSON only with keys:
{"question":"...","scientific":"4-7 sentences from science","spiritual":"4-7 sentences citing multiple traditions","philosophical":"4-7 sentences naming thinkers","historical":"3-6 sentences on human history/anthropology","synthesis":"2-4 sentences humbly bridging without collapsing views","reflection":"one contemplative question"}
Output ONLY the JSON. Be balanced, warm, honest about what is evidence vs tradition.`;
      const raw = await callLLM([{ role: 'system', content: system }, { role: 'user', content: question.trim() }], { max_tokens: 1800 });
      let parsed;
      try { parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); }
      catch { parsed = { question, scientific: raw, spiritual: '', philosophical: '', historical: '', synthesis: '', reflection: '' }; }
      try { await (await db()).collection('guru_answers').insertOne({ id: uuidv4(), question, answer: parsed, createdAt: new Date() }); } catch {}
      return NextResponse.json(parsed);
    }

    if (method === 'POST' && path === 'master') {
      const { master_id, session_id, message, history = [] } = await readBody(request);
      const master = MASTERS[master_id];
      if (!master || !message) return NextResponse.json({ error: 'invalid input' }, { status: 400 });
      const sid = session_id || uuidv4();
      const system = master.voice + '\n\nIMPORTANT: You are an AI interpretation. Keep to 3-6 short paragraphs. Warm and clear.';
      const msgs = [{ role: 'system', content: system }, ...history.slice(-8).filter(h => ['user', 'assistant'].includes(h.role)).map(h => ({ role: h.role, content: String(h.content).slice(0, 4000) })), { role: 'user', content: String(message).slice(0, 4000) }];
      const reply = await callLLM(msgs, { max_tokens: 900, temperature: 0.85 });
      try { await (await db()).collection('master_chats').insertOne({ id: uuidv4(), session_id: sid, master_id, message, reply, createdAt: new Date() }); } catch {}
      return NextResponse.json({ session_id: sid, reply, master: { id: master_id, name: master.name, tradition: master.tradition } });
    }

    // AI Book summary
    if (method === 'POST' && path === 'summarize-book') {
      const { book_id } = await readBody(request);
      const book = SACRED_BOOKS.find(b => b.id === book_id);
      if (!book) return NextResponse.json({ error: 'unknown book' }, { status: 400 });
      const prompt = `Give a warm, accessible summary of ${book.title} (${book.tradition}). Include: (1) A one-line essence, (2) Structure of the text, (3) 3-4 core teachings with brief explanations, (4) 2-3 famous verses or passages (paraphrased if unsure of exact wording), (5) Why a modern seeker should read it, (6) One suggested passage to start with. Use short paragraphs. Never invent scripture citations — paraphrase honestly.`;
      const text = await callLLM([{ role: 'user', content: prompt }], { max_tokens: 1400, temperature: 0.6 });
      return NextResponse.json({ book_id, text });
    }

    // AI-guided meditation script
    if (method === 'POST' && path === 'guided-meditation') {
      const { meditation_id, minutes = 10 } = await readBody(request);
      const m = MEDITATIONS.find(x => x.id === meditation_id);
      if (!m) return NextResponse.json({ error: 'unknown meditation' }, { status: 400 });
      const prompt = `Write a ${minutes}-minute guided meditation script for "${m.name}" (${m.desc}). Use a warm, calm, second-person voice ("Let your eyes close..."). Include gentle pauses noted as [pause]. Structure: (1) Settling in (10%), (2) Core practice (75%), (3) Closing return (15%). No metaphysical claims presented as fact. Concrete instructions only.`;
      const script = await callLLM([{ role: 'user', content: prompt }], { max_tokens: 1400, temperature: 0.7 });
      return NextResponse.json({ meditation_id, minutes, script });
    }

    // Everything Connected explorer
    if (method === 'POST' && path === 'connected') {
      const { topic } = await readBody(request);
      if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 });
      const prompt = `For the topic "${topic}", return STRICT JSON with:
{"topic":"${topic}","summary":"2-3 sentence essence","nodes":[{"name":"...","category":"science|spirit|philosophy|history|practice","why":"one sentence link back to topic"}...]}
Return 8 diverse nodes spanning categories. Output ONLY JSON.`;
      const raw = await callLLM([{ role: 'user', content: prompt }], { max_tokens: 1200, temperature: 0.7 });
      let parsed;
      try { parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); }
      catch { parsed = { topic, summary: raw, nodes: [] }; }
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: 'not found', path }, { status: 404 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
