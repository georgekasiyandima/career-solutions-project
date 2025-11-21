import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const candidates = [
  { id: 1, name: 'Tinashe Mpunga', position: 'Truck Driver', company: 'Rosteka Transport, Poland', image: '/images/Tinashe.jpg' },
  { id: 2, name: 'Daniel Majuru', position: 'HGV Driver', company: 'JMS Haulage LTD, Ireland', image: '/images/Daniel.jpg' },
  { id: 3, name: 'Oscar Appollis', position: 'Waiter', company: 'Royal Caribbean Cruises', image: '/images/Oscar.jpg' },
  { id: 4, name: 'Nathaniel Meke', position: 'Assistant Waiter', company: 'Cunard Cruises', image: '/images/Nathaniel.jpg' },
  { id: 5, name: 'Ernest Chikwira', position: 'Assistant Waiter', company: 'Carnival Cruises', image: '/images/Ernest.jpg' },
  { id: 6, name: 'Thilda Mutsago', position: 'Housekeeper', company: 'Princess Cruises', image: '/images/Thildah1.jpg' },
];

const Hired = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: '0px',
        },
      },
    ],
  };

  return (
    <div className="py-12 px-4 bg-brandLightGray">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-brandGray font-poppins mb-8 text-center">Our Successfully Hired Candidates</h2>
        <Slider {...settings}>
          {candidates.map((candidate) => (
            <div className="px-2" key={candidate.id}>
              <div className="bg-brandWhite p-4 rounded-lg shadow-soft relative">
                <div className="relative">
                  <img
                    src={candidate.image}
                    alt={`${candidate.name}, ${candidate.position} at ${candidate.company}`}
                    className="w-full h-48 object-cover rounded-md"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
                  <span className="absolute top-2 right-2 bg-brandGreen-default text-brandWhite px-2 py-1 rounded-full text-sm">Hired!</span>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-poppins text-brandGray">{candidate.name}</h3>
                  <p className="text-brandGray font-poppins">{candidate.position}</p>
                  <p className="text-gray-600 font-poppins">{candidate.company}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="text-center mt-8">
          <button className="bg-brandDarkTeal text-brandWhite px-6 py-3 rounded-md hover:bg-brandDarkTeal-hover transition-colors font-poppins">
            Join Our Success Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hired;