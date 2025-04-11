import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  API_URL = 'http://localhost:5042/';

  componentDidMount() {
    this.refreshProducts();
  }

  async refreshProducts() {
    fetch(this.API_URL + 'api/storewebapp/GetProducts')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ products: data });
      });
  } 

  render() {
    const { products } = this.state;
    return (
      <div className="App">
        <div className="container">
          <h2>My Shop</h2>
          <div className="products-grid">
            {products.map(product =>
              <div className="product-card" key={product.id || product.title}>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;