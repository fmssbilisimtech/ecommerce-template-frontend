import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useAlert } from 'react-alert'
import authHeader from '../services/auth-header'
import useFetch from 'react-fetch-hook'
import { StoreContext } from '../context/index'

const ProductPanel = ({ productId, name, image, price }) => {
    const alert = useAlert()
    const { setProductIds, productIds, isLogin, setBasketItems, basketItems } = useContext(StoreContext)
    const user = localStorage.getItem('user')
    const API_URL = 'http://89.19.23.50:9006/api/v1'

    function AddToCartButton({ productId }) {
        const [productIds, setProductIds] = useState([]);
        const { isLoading, error, data } = useFetch(API_URL + "/basket-item/basket-item", {
            headers: authHeader(),
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                quantity: 1,
                basketId: '108520d8-90c7-4b42-93e1-260fe2d4a413',
            }),
            mode: "cors"
        });

        if (isLoading) {
            return <button disabled>Adding to cart...</button>;
        }

        if (error) {
            return <div>Something went wrong: {error.message}</div>;
        }

        if (data) {
            setProductIds([...productIds, productId]);
        }

        return (
            <article>
                <div className="relative h-48 rounded">
                    <img
                        alt={name}
                        className="h-full rounded bg-black object-cover w-full"
                        src={image}
                    />
                    <div className="absolute top-0 left-0 w-full h-full rounded transition-opacity duration-500 ease-in-out opacity-0 hover:opacity-100 flex justify-center items-center bg-opacity-40 bg-gray-800">
                        <a onClick={() => setProductIds([...productIds, productId])} className="cursor-pointer relative w-10 h-10 text-white rounded-full bg-white p-2.5">
                            Add to Cart
                        </a>
                    </div>
                </div>
                <footer className="flex justify-between items-center mt-4 capitalize">
                    <h6>{name}</h6>
                    <p className="text-blue-500 tracking-widest">{price.toCurrency()}</p>
                </footer>
            </article>
        )
    }

    return <AddToCartButton productId={productId} />;
}

ProductPanel.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    grid: PropTypes.bool
}

export default ProductPanel
