// Menu Mobile
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.setAttribute('aria-label', 'Menu');
menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.innerHTML = '<span></span><span></span><span></span>';

// Inserir o botão do menu no header
const headerContainer = document.querySelector('header .container');
headerContainer.appendChild(menuToggle);

const nav = document.querySelector('header nav');
const menuItems = document.querySelectorAll('header nav ul li a');

// Função para fechar o menu
function closeMenu() {
  document.body.classList.remove('menu-open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = '';
}

// Função para verificar se é mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Função para fechar o menu
function closeMenu() {
  document.body.classList.remove('menu-open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  
  // Apenas esconder o menu se for mobile
  if (isMobile()) {
    nav.style.top = '-100%';
    setTimeout(() => {
      nav.style.display = 'none';
    }, 400);
  }
}

// Função para abrir o menu
function openMenu() {
  document.body.classList.add('menu-open');
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Mostrar e posicionar o menu
  nav.style.display = 'block';
  // Forçar reflow
  void nav.offsetHeight;
  // Aplicar a posição final
  nav.style.top = headerContainer.offsetHeight + 'px';
}

// Toggle menu
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Evitar propagação do evento
  
  // No desktop, não fazer nada (o menu sempre fica visível)
  if (!isMobile()) return;
  
  if (document.body.classList.contains('menu-open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Fechar o menu ao clicar em um item ou fora do menu
document.addEventListener('click', (e) => {
  const isClickInside = headerContainer.contains(e.target) || nav.contains(e.target);
  if (!isClickInside && document.body.classList.contains('menu-open')) {
    closeMenu();
  }
});

// Fechar menu ao clicar em um item ou fora do menu
menuItems.forEach(item => {
  item.addEventListener('click', closeMenu);
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  const isClickInside = headerContainer.contains(e.target) || nav.contains(e.target);
  if (!isClickInside && document.body.classList.contains('menu-open')) {
    closeMenu();
  }
});

// Ajustar menu ao redimensionar a janela
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (isMobile()) {
      // Em telas pequenas, garantir que o menu esteja oculto por padrão
      if (nav.style.display !== 'none' && !document.body.classList.contains('menu-open')) {
        nav.style.display = 'none';
      }
    } else {
      // Em telas grandes, garantir que o menu esteja visível
      nav.style.display = '';
      nav.style.top = '';
      nav.style.position = '';
      document.body.classList.remove('menu-open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, 100);
});

// Inicialização do menu
if (isMobile()) {
  nav.style.display = 'none';
} else {
  nav.style.display = '';
}

// Inicializar o menu como fechado em dispositivos móveis
if (window.innerWidth <= 768) {
  nav.style.display = 'none';
}

// Configurar clique na logo para voltar ao topo
const logoLink = document.querySelector('.logo-link');
if (logoLink) {
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Atualiza a URL sem o hash
    if (history.pushState) {
      history.pushState(null, null, ' ');
    } else {
      window.location.hash = '';
    }
  });
}

// Botão Voltar ao Topo
const backToTopButton = document.createElement('button');
backToTopButton.className = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Voltar ao topo');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopButton);

// Mostrar/esconder botão ao rolar
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

// Rolar suavemente ao topo
backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Função para rolar até uma posição específica
function scrollToPosition(position, duration = 800) {
  const start = window.pageYOffset;
  const distance = position - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      start,
      distance,
      duration
    );
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Função de easing para suavizar a animação
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Suaviza o scroll para os links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Fechar o menu se estiver aberto em dispositivos móveis
      if (isMobile() && document.body.classList.contains('menu-open')) {
        closeMenu();
      }
      
      // Altura do cabeçalho fixo
      const headerHeight = document.querySelector('header').offsetHeight;
      // Posição do elemento alvo
      const elementPosition = Math.floor(targetElement.getBoundingClientRect().top + window.pageYOffset);
      // Ajuste para parar exatamente na linha superior do elemento, considerando o header
      const offsetPosition = Math.max(0, elementPosition - headerHeight);
      
      // Rolar suavemente até a posição
      scrollToPosition(offsetPosition);
      
      // Atualiza a URL sem acionar o scroll novamente
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        window.location.hash = targetId;
      }
    }
  });
});

// Animar elementos ao rolar
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animate');
    }
  });
};

// Verificar animações ao carregar e ao rolar
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Adicionar classe para animação de digitação
const typeWriter = (element) => {
  const text = element.textContent;
  element.textContent = '';
  
  let i = 0;
  const speed = 50; // Velocidade da digitação em milissegundos
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  
  type();
};

// Aplicar efeito de digitação ao título principal
document.addEventListener('DOMContentLoaded', () => {
  const introTitle = document.querySelector('.intro-text h1');
  if (introTitle) {
    const originalText = introTitle.textContent;
    introText.textContent = '';
    typeWriter(introTitle, originalText);
  }
});
