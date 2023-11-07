//import { createOptimizedPicture } from '../../scripts/aem.js';

let product = {
  image: '',
  description: '',
  name: '',
  stock: '',
  price: '',
  currency: '',
};

function getProduct(sku) {
  const graphqlEndPoint = 'https://master-7rqtwti-f3ef32mfqsxfe.us-4.magentosite.cloud/graphql?query=';
  const queryParam = `
        {
          products(filter: {sku: {in: ["${sku}"]}}) {
            items {
              name
              sku
              description {
                html
              }
              image {
                url
                label
                position
                disabled
              }
              small_image {
                url
                label
                position
                disabled
              }
              thumbnail {
                url
                label
                position
                disabled
              }
              stock_status
              price_range {
                minimum_price {
                  discount {
                    percent_off
                    amount_off
                  }
                  final_price {
                    value
                    currency
                  }
                  regular_price {
                    value
                  }
                }
              }
            }
          }
        }`;

  const productQuery = graphqlEndPoint + queryParam;
  $.ajax({
    url: productQuery,
    type: 'GET',
    async: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    xhrFields: {
      withCredentials: false,
    },
    success(data) {
      product = {
        image: data.data.products.items[0].image.url,
        description: data.data.products.items[0].description.html,
        name: data.data.products.items[0].name,
        stock: data.data.products.items[0].stock_status,
        price: data.data.products.items[0].price_range.minimum_price.final_price.value,
        currency: data.data.products.items[0].price_range.minimum_price.final_price.currency,
      };
      // THIS WORKS!!
      console.log(product);
    },
    error(data) {
      console.error('Error:', 'Cannot load product');
      console.log('******** data=', data);
    },
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const sku = row.children[0].innerHTML;
    console.log(`Loading product ${sku}...`);
    // Get product information from graphQL:
    getProduct(sku);

    const li = document.createElement('li');

    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('product-card-image');
    productImageDiv.innerHTML = `<picture>
            <source type="image/jpeg" srcset="${product.image}">
            <img loading="lazy" alt="A fast-moving Tunnel" src="${product.image}?width=750&amp;format=jpeg&amp;optimize=medium">
            </picture>`;
    li.appendChild(productImageDiv);

    const productBodyDiv = document.createElement('div');
    productBodyDiv.classList.add('product-card-body');
    productBodyDiv.innerHTML = `<p>${product.name}</p><p>${product.price} ${product.currency}</p><p>${product.stock}</p><p>${product.description}</p>`;
    li.appendChild(productBodyDiv);

    ul.append(li);
  });

  //ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
