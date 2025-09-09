import React from 'react';
import PackageCard from './PackageCard';
import TourPackages from './TourPackages';
import { Col, Row } from 'reactstrap';
import Img01 from '../../assets/images/tour-img01.jpg';
import Img02 from '../../assets/images/tour-img02.jpg';
import Img03 from '../../assets/images/tour-img03.jpg';
import Img04 from '../../assets/images/tour-img04.jpg';
import Img05 from '../../assets/images/tour-img05.jpg';

function Packages() {
  const packagesData = [
    {
      price: "6,499",
      duration: "4D/3N",
      people: "2",
      image: Img01,
      location: "North Goa",
      title: "Beachside Bliss in North Goa",
      reviews: "112",
      rating: "4",
      description: "Explore the vibrant culture, nightlife, and serene beaches of North Goa. Perfect for couples or friends seeking fun and adventure."
    },
    {
      price: "7,999",
      duration: "5D/4N",
      people: "4",
      image: Img02,
      location: "South Goa",
      title: "Luxury Retreat in South Goa",
      reviews: "78",
      rating: "5",
      description: "Indulge in peace and luxury with a scenic stay near Palolem & Butterfly beach. Includes guided tours and candlelight dinners."
    },
    {
      price: "5,499",
      duration: "3D/2N",
      people: "2",
      image: Img03,
      location: "Baga Beach",
      title: "Adventure Escape at Baga Beach",
      reviews: "135",
      rating: "4",
      description: "Perfect weekend getaway with water sports, club hopping, and beachside cafes at Baga Beach. A thrill-filled short trip."
    },
    {
      price: "8,299",
      duration: "6D/5N",
      people: "5",
      image: Img04,
      location: "Panaji",
      title: "Cultural & Heritage Tour in Panaji",
      reviews: "52",
      rating: "4",
      description: "Experience Portuguese-era churches, local markets, Miramar beach and river cruises. A cultural blend of modern and historic Goa."
    },
    {
      price: "6,999",
      duration: "4D/3N",
      people: "3",
      image: Img05,
      location: "Anjuna",
      title: "Chill Vibes at Anjuna & Vagator",
      reviews: "89",
      rating: "4",
      description: "Stay near Anjuna Flea Market, sunset points, and cliffside cafes. Best for travelers who love exploring and relaxing."
    },
    {
      price: "9,499",
      duration: "7D/6N",
      people: "6",
      image: Img01,
      location: "Goa (Full)",
      title: "Complete Goa Tour (North & South)",
      reviews: "103",
      rating: "5",
      description: "Discover the best of Goa – from serene beaches to party places, spice plantations to forts – all in one unforgettable trip."
    },
    {
      price: "4,999",
      duration: "3D/2N",
      people: "2",
      image: Img02,
      location: "Candolim",
      title: "Relaxing Escape to Candolim",
      reviews: "67",
      rating: "3",
      description: "Unwind with a peaceful stay at Candolim Beach, visit Aguada Fort, and enjoy Goan cuisine by the sea."
    },
    {
      price: "7,199",
      duration: "5D/4N",
      people: "4",
      image: Img03,
      location: "Goa (Mixed)",
      title: "Family Holiday Special",
      reviews: "91",
      rating: "4",
      description: "Tailored for families with kid-friendly stays, guided sightseeing, and fun activities for all age groups across Goa."
    }
  ];
  

  return (
    <><div className="container">
      <Row>
        {packagesData.map((pkg, index) => (
          <Col lg="3" md="6" sm="12" className='mb-4' key={index}>
            <PackageCard
              price={pkg.price}
              duration={pkg.duration}
              people={pkg.people}
              location={pkg.location}
              title={pkg.title}
              reviews={pkg.reviews}
              rating={pkg.rating}
              description={pkg.description}
              image={pkg.image} />
          </Col>
        ))}
      </Row>
    </div><TourPackages /></>
  );
}

export default Packages;
