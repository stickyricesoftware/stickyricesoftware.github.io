// Dummy artwork data - Update with your actual artwork
const artworks = [
    {
        id: 1,
        title: "Malaysia",
        images: [
            "/rollerandink/images/a2-malaysia.jpg"
        ],
        cost: "$1,200",
        description: "A contemplative piece exploring the intersection of digital and analog art forms."
    },
    {
        id: 2,
        title: "Thailand",
        images: [
            "/rollerandink/images/a2-thailand.jpg"
        ],
        cost: "$950",
        description: "Bold geometric patterns that challenge our perception of space and dimension."
    },
    {
        id: 3,
        title: "Books and cats",
        images: [
            "/rollerandink/images/a3-books-and-cats.jpg",
        ],
        cost: "$1,500",
        description: "A minimalist approach to capturing calm and tranquility through color and form."
    },
    {
        id: 4,
        title: "Boombox",
        images: [
            "/rollerandink/images/a3-boombox.jpg"
        ],
        cost: "$1,100",
        description: "Flowing layers of color that evoke movement and emotion without boundaries."
    },
    {
        id: 5,
        title: "I see you",
        images: [
            "/rollerandink/images/a3-i-see-you.jpg",
        ],
        cost: "$1,800",
        description: "An exploration of landscape abstraction, where reality meets imagination."
    },
    {
        id: 6,
        title: "Mine",
        images: [
            "/rollerandink/images/a3-mine.jpg"
        ],
        cost: "$800",
        description: "A refined study in contrast, form, and the beauty of simplicity."
    },
    {
        id: 6,
        title: "On The Beach",
        images: [
            "/rollerandink/images/a3-on-the-beach.jpg"
        ],
        cost: "$800",
        description: "A refined study in contrast, form, and the beauty of simplicity."
    },
    {
        id: 6,
        title: "Oriental Pied Hornbill",
        images: [
            "/rollerandink/images/a3-oriental-pied-hornbill-chine-colle.jpg",
            "/rollerandink/images/a3-oriental-pied-hornbill.jpg"

        ],
        cost: "$800",
        description: "A refined study in contrast, form, and the beauty of simplicity."
    }


    
];

// Render gallery on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGallery(artworks);
});

// Function to render artworks
function renderGallery(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    works.forEach(artwork => {
        const artworkElement = createArtworkCard(artwork);
        gallery.appendChild(artworkElement);
    });
}

// Function to create individual artwork card
function createArtworkCard(artwork) {
    const card = document.createElement('div');
    card.className = 'artwork';

    // Create images container
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'artwork-images';

    // Add first image
    const mainImage = document.createElement('img');
    mainImage.src = artwork.images[0];
    mainImage.alt = artwork.title;
    mainImage.className = 'artwork-image';
    mainImage.style.cursor = 'pointer';
    mainImage.addEventListener('click', () => openModal(artwork, 0));
    imagesContainer.appendChild(mainImage);

    // Add image counter if multiple images
    if (artwork.images.length > 1) {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.textContent = `+${artwork.images.length - 1}`;
        counter.style.cursor = 'pointer';
        counter.addEventListener('click', () => openModal(artwork, 0));
        imagesContainer.appendChild(counter);
    }

    // Add thumbnail gallery if multiple images
    if (artwork.images.length > 1) {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'artwork-thumbnails';

        artwork.images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imgSrc;
            thumbnail.alt = `${artwork.title} - Image ${index + 1}`;
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.addEventListener('click', () => {
                updateMainImage(mainImage, imgSrc);
                updateActiveThumbnail(thumbnailContainer, index);
            });
            thumbnail.addEventListener('dblclick', () => openModal(artwork, index));
            thumbnailContainer.appendChild(thumbnail);
        });

        imagesContainer.appendChild(thumbnailContainer);
    }

    // Create info section
    const info = document.createElement('div');
    info.className = 'artwork-info';

    const title = document.createElement('h2');
    title.className = 'artwork-title';
    title.textContent = artwork.title;
    info.appendChild(title);

    const description = document.createElement('p');
    description.className = 'artwork-description';
    description.textContent = artwork.description;
    info.appendChild(description);

    // Create footer with price and image count
    const footer = document.createElement('div');
    footer.className = 'artwork-footer';

    const price = document.createElement('span');
    price.className = 'artwork-price';
    price.textContent = artwork.cost;
    footer.appendChild(price);

    const imageIndicator = document.createElement('span');
    imageIndicator.className = 'image-indicator';
    imageIndicator.textContent = `${artwork.images.length} image${artwork.images.length > 1 ? 's' : ''}`;
    footer.appendChild(imageIndicator);

    info.appendChild(footer);

    // Assemble card
    card.appendChild(imagesContainer);
    card.appendChild(info);

    return card;
}

// Update main image when thumbnail is clicked
function updateMainImage(mainImage, newSrc) {
    mainImage.style.opacity = '0.5';
    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
    }, 100);
}

// Update active thumbnail styling
function updateActiveThumbnail(container, activeIndex) {
    const thumbnails = container.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === activeIndex);
    });
}

// Modal functionality
let currentModalArtwork = null;
let currentModalIndex = 0;

function openModal(artwork, imageIndex) {
    currentModalArtwork = artwork;
    currentModalIndex = imageIndex;

    const modal = document.getElementById('imageModal') || createModal();
    const modalImage = modal.querySelector('.modal-image');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    const counter = modal.querySelector('.modal-counter');

    modalImage.src = artwork.images[imageIndex];
    modalImage.alt = artwork.title;
    counter.textContent = `${imageIndex + 1} / ${artwork.images.length}`;

    prevBtn.disabled = imageIndex === 0;
    nextBtn.disabled = imageIndex === artwork.images.length - 1;

    modal.classList.add('active');
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'modal';

    modal.innerHTML = `
        <button class="modal-close">×</button>
        <div class="modal-content">
            <img class="modal-image" src="" alt="">
            <div class="modal-nav">
                <button class="modal-button modal-prev">← Previous</button>
                <span class="modal-counter"></span>
                <button class="modal-button modal-next">Next →</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close button
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // Navigation buttons
    modal.querySelector('.modal-prev').addEventListener('click', () => {
        if (currentModalIndex > 0) openModal(currentModalArtwork, currentModalIndex - 1);
    });

    modal.querySelector('.modal-next').addEventListener('click', () => {
        if (currentModalIndex < currentModalArtwork.images.length - 1) {
            openModal(currentModalArtwork, currentModalIndex + 1);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleModalKeydown);

    return modal;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.classList.remove('active');
}

function handleModalKeydown(e) {
    const modal = document.getElementById('imageModal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentModalIndex > 0) {
        openModal(currentModalArtwork, currentModalIndex - 1);
    }
    if (e.key === 'ArrowRight' && currentModalIndex < currentModalArtwork.images.length - 1) {
        openModal(currentModalArtwork, currentModalIndex + 1);
    }
}
