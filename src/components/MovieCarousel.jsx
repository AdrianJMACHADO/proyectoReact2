import React from 'react';
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';
// Importa las imágenes
import inception from '../assets/images/inception.jpg';
import darkKnight from '../assets/images/darkKnight.jpg';
import interstellar from '../assets/images/interstellar.jpg';

function MovieCarousel() {
    // Array de películas usando las imágenes importadas
    const movies = [
        {
            id: 1,
            title: "Inception",
            image: inception
        },
        {
            id: 2,
            title: "The Dark Knight",
            image: darkKnight
        },
        {
            id: 3,
            title: "Interstellar",
            image: interstellar
        }
    ];

    const customStyles = {
        icon: {
            filter: 'invert(98%) sepia(97%) saturate(1%) hue-rotate(90deg) brightness(100%) contrast(100%)' // Color amarillo IMDb
        },
        carouselInner: {
            backgroundColor: '#f0f0f0' // Fondo gris
        },
        image: {
            height: '600px',
            objectFit: 'contain',
            backgroundColor: '#f0f0f0' // Fondo gris del área sobrante
        }
    };

    return (
        <div className="w-full" style={{ backgroundColor: '#f0f0f0', position: 'relative' }}> {/* Fondo gris */}
            <MDBCarousel
                showControls
                showIndicators
                interval={3000}
                className="custom-carousel"
                style={customStyles.carouselInner}
            >
                {movies.map((movie) => (
                    <MDBCarouselItem
                        key={movie.id}
                        itemId={movie.id}
                    >
                        <img
                            src={movie.image}
                            className="d-block w-100"
                            alt={movie.title}
                            style={customStyles.image}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fs-2">{movie.title}</h5>
                        </div>
                    </MDBCarouselItem>
                ))}
                {/* Botón anterior */}
                <a
                    className="carousel-control-prev"
                    href="#custom-carousel"
                    role="button"
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                        style={customStyles.icon}
                    />
                    <span className="visually-hidden">Previous</span>
                </a>
                {/* Botón siguiente */}
                <a
                    className="carousel-control-next"
                    href="#custom-carousel"
                    role="button"
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                        style={customStyles.icon}
                    />
                    <span className="visually-hidden">Next</span>
                </a>
            </MDBCarousel>
        </div>
    );
}

export default MovieCarousel;
