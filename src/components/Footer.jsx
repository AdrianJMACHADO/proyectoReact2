import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter 
      bgColor='dark' 
      className='text-center text-lg-left'
      style={{ 
        backgroundColor: '#000000', 
        color: '#F5C518',
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '60px', // Altura fija para el footer
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className='text-center p-3' 
        style={{ 
          backgroundColor: '#000000', 
          color: '#F5C518',
          width: '100%'
        }}
      >
        &copy; {new Date().getFullYear()} Copyright:{' '}
        <a 
          className='text-decoration-none' 
          href='https://www.cinemax.com/' 
          style={{ 
            color: '#F5C518',
            fontWeight: 'bold'
          }}
        >
          Cinemax.com
        </a>
      </div>
    </MDBFooter>
  );
}