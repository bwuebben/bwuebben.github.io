// Enlarge a plate in place. Without JavaScript, or with a modifier key held,
// each plate link opens its image file directly.
(() => {
  const viewer = document.querySelector('#viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('p');

  document.querySelectorAll('.gallery-app a.plate').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = link.closest('figure').querySelector('.plate-title').textContent;
      viewer.showModal();
    });
  });

  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  // A click on the backdrop lands on the dialog element itself.
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
})();
