// filtro.js
// Responsável pelo filtro de projetos + melhorias no comportamento de acessibilidade e animação

document.addEventListener('DOMContentLoaded', () => {
  const filtroBotoes = Array.from(document.querySelectorAll('.filtro_btn'));
  const projetos = Array.from(document.querySelectorAll('.card_projeto'));
  const projectsGrid = document.getElementById('projects-grid');

  // Helper: mostra projeto (com animação)
  function showProject(el) {
    if (!el) return;
    el.classList.remove('is-hidden', 'fade-out');
    // força reflow para reiniciar animação
    void el.offsetWidth;
    el.classList.add('fade-in');
    // remove classe de entrada depois da animação
    setTimeout(() => el.classList.remove('fade-in'), 300);
  }

  // Helper: esconde projeto (com animação)
  function hideProject(el) {
    if (!el) return;
    el.classList.add('fade-out');
    // após animação, aplica is-hidden para remover do fluxo
    setTimeout(() => {
      el.classList.add('is-hidden');
      el.classList.remove('fade-out');
    }, 220);
  }

  // Função principal de filtro
  function aplicarFiltro(filtro) {
    projetos.forEach(projeto => {
      const matches = filtro === 'todos' || projeto.classList.contains(filtro);
      if (matches) {
        showProject(projeto);
      } else {
        hideProject(projeto);
      }
    });
  }

  // Inicial: garantir que todos estejam visíveis
  aplicarFiltro('todos');

  // Evento para cada botão
  filtroBotoes.forEach(btn => {
    // clique
    btn.addEventListener('click', () => {
      filtroBotoes.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filtro = btn.dataset.filter || 'todos';
      aplicarFiltro(filtro);
    });

    // permitir navegação por teclado (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Se futuramente adicionar projetos dinamicamente, observar mudanças
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      // atualizar lista local
      // (obs: se desejar que categorias sejam extraídas automaticamente, posso implementar)
    });
    observer.observe(projectsGrid, { childList: true, subtree: true });
  }

  // small accessibility enhancement: allow filter with left/right arrow when focus on buttons
  filtroBotoes.forEach((btn, idx) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        const next = filtroBotoes[(idx + 1) % filtroBotoes.length];
        next.focus();
      } else if (e.key === 'ArrowLeft') {
        const prev = filtroBotoes[(idx - 1 + filtroBotoes.length) % filtroBotoes.length];
        prev.focus();
      }
    });
  });

});
