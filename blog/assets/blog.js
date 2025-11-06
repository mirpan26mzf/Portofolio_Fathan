    // ==================== Data Dummy Post ====================
    const POSTS = [
      {
        id: 'introduksi-template-blog',
        title: 'Introduksi Template Blog: Fitur & Cara Pakai',
        date: '2025-10-10',
        author: 'MZ Fathan',
        category: 'Tips',
        tags: ['Template', 'Panduan'],
        cover: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1280&auto=format&fit=crop',
        excerpt: 'Kenalan dengan template blog modern serba cepat: dark mode, search real-time, kategori, dan SPA detail post.',
        body: `
          <p>Template ini dirancang untuk <strong>ringan</strong>, <strong>aksesibel</strong>, dan <strong>mudah diubah</strong>. Semuanya berada di satu file HTML, cocok untuk deploy cepat.</p>
          <h2>Fitur kunci</h2>
          <ul>
            <li>Dark/Light mode dengan penyimpanan preferensi.</li>
            <li>Pencarian judul & ringkasan secara real-time.</li>
            <li>Filter kategori + tag, serta pagination.</li>
            <li>Detail posting via <code>#post/&lt;id&gt;</code> tanpa reload.</li>
          </ul>
          <p>Tinggal ganti data di variabel <code>POSTS</code> untuk mulai nge‑blog.</p>
        `,
      },
      {
        id: 'desain-sistem-token',
        title: 'Desain Sistem Token Warna untuk Dark Mode',
        date: '2025-09-18',
        author: 'Irpan',
        category: 'Desain',
        tags: ['UI', 'Dark Mode'],
        cover: 'https://images.unsplash.com/photo-1526481280698-8fcc13fd1b4d?q=80&w=1280&auto=format&fit=crop',
        excerpt: 'Belajar menyusun design tokens agar tampilan konsisten di light & dark mode.',
        body: `
          <p>Dengan CSS variables, kamu bisa membuat tema yang konsisten dan mudah diatur.</p>
          <pre><code>:root{ --surface:#fff; --text:#0f172a }\nhtml[data-theme="dark"]{ --surface:#0b1020; --text:#e5e7eb }</code></pre>
          <p>Gunakan class/atribut pada <code>&lt;html&gt;</code> untuk mengganti tema.</p>
        `,
      },
      {
        id: 'tips-performa-web',
        title: 'Tips Performa Web: Kecilkan, Tunda, Cache!',
        date: '2025-08-05',
        author: 'MZ Fathan',
        category: 'Programming',
        tags: ['Performance', 'Best Practice'],
        cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1280&auto=format&fit=crop',
        excerpt: 'Beberapa prinsip sederhana yang meningkatkan kecepatan loading.',
        body: `
          <p>Mulai dari gambar terkompres, lazy loading, dan minimalkan blocking scripts.</p>
          <p>Implementasikan strategi caching agar kunjungan berikutnya makin cepat.</p>
        `,
      },
      // Tambahkan artikel lain sesuka kamu
    ];

    // ==================== State & Helpers ====================
    const state = {
      q: '',
      category: 'Semua',
      page: 1,
      perPage: 6,
    };

    const el = (sel) => document.querySelector(sel);
    const els = (sel) => Array.from(document.querySelectorAll(sel));

    const formatDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric'});

    // ==================== Render Chips (Kategori) ====================
    const categories = ['Semua', ...Array.from(new Set(POSTS.map(p=>p.category)))];
    function renderChips(){
      const wrap = el('#chips');
      wrap.innerHTML = '';
      categories.forEach(cat =>{
        const a = document.createElement('button');
        a.className = 'chip' + (state.category===cat ? ' active' : '');
        a.textContent = cat;
        a.setAttribute('aria-pressed', state.category===cat);
        a.addEventListener('click', ()=>{ state.category = cat; state.page=1; routeTo('#'); render(); });
        wrap.appendChild(a);
      });
    }

    // ==================== Filter & Paginate ====================
    function getFiltered(){
      const q = state.q.trim().toLowerCase();
      let items = POSTS.slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
      if (state.category !== 'Semua') items = items.filter(p=>p.category===state.category);
      if (q) items = items.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
      return items;
    }

    function paginate(items){
      const total = Math.ceil(items.length / state.perPage) || 1;
      const start = (state.page-1)*state.perPage;
      return { items: items.slice(start, start+state.perPage), total };
    }

    // ==================== Render Grid ====================
    function renderGrid(){
      const grid = el('#grid');
      const { items, total } = paginate(getFiltered());
      grid.innerHTML = '';
      items.forEach(p=>{
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <a href="#post/${p.id}" class="thumb"><img loading="lazy" src="${p.cover}" alt="${p.title}"></a>
          <div class="card-body">
            <div class="meta">
              <span>${p.category}</span> · <time datetime="${p.date}">${formatDate(p.date)}</time>
            </div>
            <a href="#post/${p.id}" class="title">${p.title}</a>
            <p class="desc">${p.excerpt}</p>
          </div>
        `;
        grid.appendChild(card);
      });
      renderPagination(total);
    }

    function renderPagination(total){
      const nav = el('#pagination');
      nav.innerHTML = '';
      const makeBtn = (label, page, disabled=false)=>{
        const b = document.createElement('button');
        b.className = 'btn';
        b.textContent = label;
        b.disabled = disabled;
        b.addEventListener('click', ()=>{ state.page = page; window.scrollTo({top:0, behavior:'smooth'}); renderGrid(); });
        return b;
      }
      nav.appendChild(makeBtn('«', 1, state.page===1));
      nav.appendChild(makeBtn('‹', Math.max(1,state.page-1), state.page===1));
      const info = document.createElement('span'); info.style.padding = '.6rem 1rem'; info.textContent = `Hal ${state.page} dari ${total}`;
      nav.appendChild(info);
      nav.appendChild(makeBtn('›', Math.min(total, state.page+1), state.page===total));
      nav.appendChild(makeBtn('»', total, state.page===total));
    }

    // ==================== Post Detail ====================
    function renderPost(id){
      const p = POSTS.find(x=>x.id===id);
      if(!p){ routeTo('#'); return }
      el('#postTitle').textContent = p.title;
      el('#postMeta').innerHTML = `${p.author} · <time datetime="${p.date}">${formatDate(p.date)}</time>`;
      el('#postCover').src = p.cover; el('#postCover').alt = p.title;
      el('#postBody').innerHTML = p.body;
      const tags = el('#postTags'); tags.innerHTML = '';
      p.tags?.forEach(t=>{ const s = document.createElement('span'); s.className='tag'; s.textContent = `#${t}`; tags.appendChild(s); });
    }

    // ==================== Router Sederhana ====================
    function routeTo(hash){ window.location.hash = hash; }
    function router(){
      const hash = decodeURIComponent(window.location.hash || '#');
      const [path, param] = hash.replace('#','').split('/');
      if(path==='post' && param){
        el('#homeView').hidden = true;
        el('#postView').hidden = false;
        renderPost(param);
      } else if (path==='kategori' && param){
        state.category = param; state.page = 1;
        el('#postView').hidden = true; el('#homeView').hidden = false; render();
      } else {
        el('#postView').hidden = true; el('#homeView').hidden = false; render();
      }
    }

    // ==================== Theme Toggle ====================
    function applyTheme(t){
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
      const isDark = t==='dark';
      el('#sun').style.display = isDark ? 'none' : '';
      el('#moon').style.display = isDark ? '' : 'none';
    }

    // ==================== Animasi Masuk ====================
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.05 });

    // ==================== Init ====================
    function init(){
      // Tahun
      el('#year').textContent = new Date().getFullYear();

      // Theme
      applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
      el('#themeToggle').addEventListener('click', ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark'));
      el('#mobileTheme').addEventListener('click', ()=> applyTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark'));

      // Search
      const search = el('#search');
      const updateQ = () => { state.q = search.value; state.page = 1; renderGrid(); };
      search.addEventListener('input', updateQ);
      window.addEventListener('keydown', (e)=>{ if((e.ctrlKey||e.metaKey) && e.key==='/'){ e.preventDefault(); search.focus(); }});

      // Chips
      renderChips();

      // Render pertama
      renderGrid();

      // Animasi
      els('[data-animate]').forEach(n=> io.observe(n));

      // Router
      window.addEventListener('hashchange', router);
      router();

      // Hamburger + Drawer
      const hamb = el('#hamb');
      const drawer = el('#drawer');
      const openDrawer = ()=>{ drawer.classList.add('active'); hamb.classList.add('active'); };
      const closeDrawer = ()=>{ drawer.classList.remove('active'); hamb.classList.remove('active'); };
      hamb.addEventListener('click', ()=> drawer.classList.contains('active') ? closeDrawer() : openDrawer());
      drawer.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) closeDrawer(); });
      document.addEventListener('click', (e)=>{
        // klik di luar hamb saat terbuka → tutup
        if(drawer.classList.contains('active')){
          const panel = drawer.querySelector('.panel');
          if(!panel.contains(e.target) && !hamb.contains(e.target)) closeDrawer();
        }
      });

      // Reset filter
      el('#clearFilters').addEventListener('click', ()=>{ state.q=''; el('#search').value=''; state.category='Semua'; state.page=1; render(); });
    }

    function render(){ renderChips(); renderGrid(); }

    document.addEventListener('DOMContentLoaded', init);
  document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("aboutModal");
  const openBtn = document.querySelector('a[href="#tentang"]');
  const closeBtn = modal.querySelector(".close-btn");

  if (!modal || !openBtn || !closeBtn) {
    console.warn("Elemen popup tidak ditemukan!");
    return;
  }

  });

document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("aboutModal");
  const closeBtn = modal.querySelector(".close-btn");

  // Klik tombol "Tentang" → pakai delegation
  document.body.addEventListener("click", function(e){
    const target = e.target.closest('a[href="#tentang"]');
    if(target){
      e.preventDefault();
      modal.style.display = "flex";
    }
  });

  // Klik tombol "X"
  closeBtn.addEventListener("click", function(){
    modal.style.display = "none";
  });

  // Klik di luar modal
  window.addEventListener("click", function(e){
    if(e.target === modal){
      modal.style.display = "none";
    }
  });
});
