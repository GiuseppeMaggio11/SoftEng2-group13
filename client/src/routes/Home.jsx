import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>This is the Home page.</h2>
      <Link to="/customer"><button>Customer Interface</button></Link>
      <Link to="/manager"><button>Manager Interface</button></Link>
       {/*add other buttons*/}
    </div>
  );
}


export default Home;