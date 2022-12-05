import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

export default function Slide({ slides }) {
  return (
    <Carousel slide={false}>
      {slides.map(([slide, caption], i) => (
        <Carousel.Item>
          {slide}
          <Carousel.Caption>
            <h2>{caption}</h2>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
