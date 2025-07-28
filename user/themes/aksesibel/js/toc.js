anchors.options = {
    visible: 'hover',
    placement: 'right'
};
anchors.add('.content h2');

generateTableOfContents(anchors.elements);
setupScrollSpy(anchors.elements);

function generateTableOfContents(els) {
    var anchoredElText, anchoredElHref;
    var ul = document.createElement('UL');
    ul.id = 'toc-content';
    ul.className = 'collapse show';
    document.getElementById('toc').appendChild(ul);

    var lastH2Li = null;

    for (var i = 0; i < els.length; i++) {
        var tagName = els[i].tagName;
        anchoredElText = els[i].textContent;

        var anchorLink = els[i].querySelector('.anchorjs-link');
        if (!anchorLink) continue;
        anchoredElHref = anchorLink.getAttribute('href');

        if (tagName === 'H2') {
            // Buat H2 item
            lastH2Li = document.createElement('LI');
            lastH2Li.className = 'toc-li-H2';

            var anchorItem = document.createElement('A');
            anchorItem.href = anchoredElHref;
            anchorItem.textContent = anchoredElText;

            lastH2Li.appendChild(anchorItem);
            ul.appendChild(lastH2Li);

        } else if (tagName === 'H3') {
            // Pastikan ada H2 sebelumnya
            if (!lastH2Li) continue;

            // Cek kalau belum ada sub-UL di dalam H2
            var subUl = lastH2Li.querySelector('ul');
            if (!subUl) {
                subUl = document.createElement('UL');
                lastH2Li.appendChild(subUl);
            }

            // Buat H3 item
            var subLi = document.createElement('LI');
            subLi.className = 'toc-li-H3';

            var subAnchor = document.createElement('A');
            subAnchor.href = anchoredElHref;
            subAnchor.textContent = anchoredElText;

            subLi.appendChild(subAnchor);
            subUl.appendChild(subLi);
        }
    }
}
// Scrollspy TOC
function setupScrollSpy(els) {
    window.addEventListener('scroll', function() {
        var fromTop = window.scrollY + 100; // 20px offset dari atas viewport

        // Hapus semua active class
        var tocLinks = document.querySelectorAll('#toc-content a');
        tocLinks.forEach(function(link) {
            link.classList.remove('active');
        });

        // Cari heading yang aktif
        var current = null;
        els.forEach(function(el) {
            if (el.offsetTop <= fromTop) {
                current = el;
            }
        });

        if (current) {
            var anchorLink = current.querySelector('.anchorjs-link');
            if (anchorLink) {
                var href = anchorLink.getAttribute('href');
                var tocLink = document.querySelector('#toc-content a[href="' + href + '"]');
                if (tocLink) tocLink.classList.add('active');
            }
        }
    });
}

