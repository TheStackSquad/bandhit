import React from 'react';
import Card from './Card';

const HubGrid = ({ data }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {data.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </section>
  );
};

export default HubGrid;
