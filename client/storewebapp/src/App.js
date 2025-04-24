import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: []
    };
  }

  API_URL = 'http://localhost:5042/';

  componentDidMount(){
    fetch(this.API_URL + 'api/storewebapp/GetProducts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ products: data });
      });
  }

  render(){
    const { products } = this.state;
    return (
      <div className="App">
        <header className="header">
          <h1>Sklep Wszystko i Nic</h1>
        </header>
        <div className="container">
          <div className="products-list">
            {products.map(product => (
              <div className="product-card" key={product.id || product.title}>
                {product.image_url && (
                  <div className="product-image">
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                    />
                  </div>
                )}
                <div className="product-details">
                  <div className="details-text">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                  </div>
                  <button className="buy-button">Kup teraz</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="footer">
          <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default App;