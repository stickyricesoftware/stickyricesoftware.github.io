// Dummy artwork data - Update with your actual artwork
const artworks = [
    {
        id: 1,
        title: "Malaysia",
        images: [
            "https://stickyricesoftware.github.io/rollerandink/A2-Malaysia_.jpg",
            "https://picsum.photos/500/500?random=1"
        ],
        cost: "$1,200",
        description: "A contemplative piece exploring the intersection of digital and analog art forms."
    },
    {
        id: 2,
        title: "Urban Geometry",
        images: [
            "https://picsum.photos/500/500?random=2"
        ],
        cost: "$950",
        description: "Bold geometric patterns that challenge our perception of space and dimension."
    },
    {
        id: 3,
        title: "Serenity",
        images: [
            "https://picsum.photos/500/500?random=3",
            "https://picsum.photos/500/500?random=4"
        ],
        cost: "$1,500",
        description: "A minimalist approach to capturing calm and tranquility through color and form."
    },
    {
        id: 4,
        title: "Chromatic Waves",
        images: [
            "https://picsum.photos/500/500?random=5"
        ],
        cost: "$1,100",
        description: "Flowing layers of color that evoke movement and emotion without boundaries."
    },
    {
        id: 5,
        title: "Abstract Horizon",
        images: [
            "https://picsum.photos/500/500?random=6",
            "https://picsum.photos/500/500?random=7",
            "https://picsum.photos/500/500?random=8"
        ],
        cost: "$1,800",
        description: "An exploration of landscape abstraction, where reality meets imagination."
    },
    {
        id: 6,
        title: "Monochrome Study",
        images: [
            "https://picsum.photos/500/500?random=9"
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
    imagesContainer.appendChild(mainImage);

    // Add image counter if multiple images
    if (artwork.images.length > 1) {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.textContent = `+${artwork.images.length - 1}`;
        imagesContainer.appendChild(counter);
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
