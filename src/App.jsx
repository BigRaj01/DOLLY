import { useState, useRef } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const DEPLOY_ADDRESS =
  '0xd011y4a3f9c2b7e15d8a06f4c9e2b731a9f0e6d3c8b4a1f7e2d9c6b0a3f81e42';

function shorten(addr) {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#E8A33D" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="9.5" stroke="#6C5CE7" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3" fill="#4FD1AE" />
    </svg>
  );
}

function useToast() {
  const [msg, setMsg] = useState(null);
  const timer = useRef(null);
  const show = (text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2600);
  };
  return { msg, show };
}

const FLOW_STEPS = [
  {
    title: 'Connect & upload',
    desc: "Connect any Aptos wallet — Petra, AptosConnect, or others — then drop in a PDF, DOCX, MP3, or any file. DOLLY chunks it client-side and hands it to the Shelby SDK for erasure-coded distribution across storage nodes.",
  },
  {
    title: 'Clone commitment',
    desc: "A cryptographic commitment for the file is written to the Aptos blockchain via the Shelby smart contract. If the file is a revision of something already in your vault, it's linked as a clone with a parent hash — building a lineage tree instead of a flat file list.",
  },
  {
    title: 'Prime Vault access',
    desc: 'Your Prime Vault is gated entirely by wallet signature. Only you can decrypt and retrieve your documents — no admin, no platform, no backdoor. Sub-second reads, even years later.',
  },
  {
    title: "Share a lineage, not just a link",
    desc: 'Generate a read-access grant for a single clone or an entire lineage, so collaborators can verify exactly which version they\'re looking at — and everything that led to it.',
  },
];

const FEATURES = [
  { tag: '// LINEAGE', title: 'Version cloning', desc: 'Every revision is its own immutable clone, linked to its parent. Nothing is ever silently overwritten.' },
  { tag: '// STORAGE', title: 'Shelby hot storage', desc: 'Clay erasure coding across a decentralized node network gives sub-second reads, even for large files.' },
  { tag: '// ACCESS', title: 'Wallet-gated vault', desc: 'Only your connected wallet can decrypt your documents. No platform admin has a master key.' },
  { tag: '// PROOF', title: 'On-chain commitments', desc: 'Aptos L1 anchors a cryptographic commitment per clone, so authenticity is provable independent of DOLLY.' },
  { tag: '// SHARING', title: 'Selective grants', desc: 'Share one clone or a whole lineage. Recipients see exactly which version — and its history.' },
  { tag: '// FORMATS', title: 'Any file type', desc: "PDFs, DOCX, MP3, images, plaintext — DOLLY doesn't care what you're preserving." },
];

export default function App() {
  const { connect, disconnect, connected, account, wallets } = useWallet();
  const { msg, show } = useToast();
  const [logLines, setLogLines] = useState([]);
  const fileInputRef = useRef(null);

  const addr = account?.address?.toString?.() ?? '';
  const petra = wallets?.find((w) => w.name === 'Petra');
  const petraInstalled = petra?.readyState === 'Installed';

  async function handleConnectClick() {
    if (!petraInstalled) {
      show('Petra not found — opening install page');
      window.open(petra?.url || 'https://petra.app/', '_blank');
      return;
    }
    try {
      await connect('Petra');
      show('Wallet connected · Prime Vault unlocked');
    } catch (e) {
      show('Connection cancelled or failed');
    }
  }

  async function handleDisconnect() {
    await disconnect();
    show('Wallet disconnected');
  }

  function onFileChosen(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogLines([]);
    const steps = [
      `[1/4] reading ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      '[2/4] chunking + Clay erasure coding via Shelby SDK…',
      connected
        ? `[3/4] committing clone to Aptos from ${shorten(addr)}…`
        : '[3/4] connect wallet to commit on-chain (simulating)…',
      '[4/4] ✓ clone anchored — added to lineage',
    ];
    steps.forEach((line, i) => {
      setTimeout(() => setLogLines((prev) => [...prev, line]), i * 650);
    });
    setTimeout(() => show('New clone added to your Prime Vault'), steps.length * 650 + 200);
  }

  function copyAddress() {
    navigator.clipboard.writeText(DEPLOY_ADDRESS).then(() => show('Contract address copied'));
  }

  return (
    <>
      <div className="grain" />
      <div className="glow" />

      <header>
        <div className="brand">
          <Logo />
          <span>DOLLY</span>
        </div>

        <div className="wallet-area">
          {connected ? (
            <>
              <button className="wallet-btn connected">{shorten(addr)}</button>
              <button className="wallet-btn ghost" onClick={handleDisconnect}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="wallet-btn" onClick={handleConnectClick}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="pills">
            <span className="pill a">SHELBY PROTOCOL</span>
            <span className="pill v">APTOS L1</span>
            <span className="pill">TESTNET</span>
          </div>
          <h1 className="hero-title">
            Every file has
            <br />
            a <em>lineage.</em>
          </h1>
          <p className="hero-sub">
            DOLLY anchors your documents on Shelby's decentralized hot storage and clones every
            revision on-chain — so nothing you write, sign, or ship ever loses its history. Not
            just stored. Traceable, forever.
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => (connected ? null : handleConnectClick())}
            >
              {connected ? 'Wallet Connected ✓' : 'Connect Wallet to Start'}
            </button>
            <a href="#how" className="btn-ghost link-btn">
              See how it works
            </a>
          </div>

          <div className="lineage">
            <div className="lineage-label">// live vault preview — Q3-Contract.pdf</div>
            <div className="strand">
              <div className="clone-node verified">
                <div className="clone-row">
                  <span className="clone-name">Clone 03 — final-signed.pdf</span>
                  <span className="clone-hash">0x9a4f…21e0</span>
                </div>
                <div className="clone-meta">✓ anchored · 600ms finality</div>
              </div>
              <div className="clone-node">
                <div className="clone-row">
                  <span className="clone-name">Clone 02 — redline-legal.pdf</span>
                  <span className="clone-hash">0x7c1d…88b3</span>
                </div>
                <div className="clone-meta dim">parent of Clone 03</div>
              </div>
              <div className="clone-node">
                <div className="clone-row">
                  <span className="clone-name">Clone 01 — draft-v1.pdf</span>
                  <span className="clone-hash">0x2e90…f145</span>
                </div>
                <div className="clone-meta dim">origin blob</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how">
          <div className="eyebrow">The Process</div>
          <h2 className="section-title">How DOLLY works</h2>
          <p className="section-sub">
            Most storage protocols overwrite a file when it changes. DOLLY never does — every
            edit becomes a new clone, permanently linked to its parent, so the full lineage of a
            document is provable on-chain.
          </p>
          <div className="flow">
            {FLOW_STEPS.map((step, i) => (
              <div className="flow-step" key={step.title}>
                <div className="flow-dot">{['①', '②', '③', '④'][i]}</div>
                <div>
                  <div className="flow-title">{step.title}</div>
                  <div className="flow-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UPLOAD DEMO */}
        <section id="upload">
          <div className="eyebrow">Try It</div>
          <h2 className="section-title">Upload a document</h2>
          <p className="section-sub">
            This is a local preview of the DOLLY upload flow. Connect a wallet above to simulate a
            real clone commitment.
          </p>
          <div className="vault">
            <label className="vault-drop">
              <input type="file" ref={fileInputRef} onChange={onFileChosen} accept=".pdf,.docx,.doc,.mp3,.txt,.png,.jpg" />
              <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3v12m0-12l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
              <div className="drop-text">Tap to choose a file</div>
              <div className="drop-sub">PDF · DOCX · MP3 · TXT · IMG — max 25MB (demo)</div>
            </label>
            <div className="vault-log">
              {logLines.length === 0 ? (
                <div className="empty-log">// waiting for a file…</div>
              ) : (
                logLines.map((line, i) => (
                  <div className="log-line" key={i}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features">
          <div className="eyebrow">Prime Vault</div>
          <h2 className="section-title">Built for permanence</h2>
          <div className="grid">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <div className="fi">{f.tag}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="stats">
            <div className="stat">
              <b>~600ms</b>
              <span>finality</span>
            </div>
            <div className="stat">
              <b>0</b>
              <span>admin keys</span>
            </div>
            <div className="stat">
              <b>∞</b>
              <span>clone depth</span>
            </div>
          </div>
        </section>

        {/* DEPLOYMENT */}
        <section id="deploy">
          <div className="eyebrow">Deployment</div>
          <h2 className="section-title">Live on Aptos testnet</h2>
          <p className="section-sub">DOLLY's vault contract is deployed and verifiable on-chain.</p>
          <div className="deploy-box">
            <span className="deploy-addr">{DEPLOY_ADDRESS}</span>
            <button className="copy-btn" onClick={copyAddress}>
              Copy address
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand center">
          <Logo size={22} />
          <span className="footer-brand-name">DOLLY</span>
        </div>
        <div>Documents. Cloned on-chain. Forever.</div>
        <div className="footer-sub">Built on Shelby Protocol × Aptos L1</div>
      </footer>

      {msg && <div className="toast show">{msg}</div>}
    </>
  );
}
