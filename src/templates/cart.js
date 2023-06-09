import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context'
import { Link, useHistory } from 'react-router-dom'
import Counter from '../components/Counter'
import axios from 'axios'
import authHeader from '../services/auth-header'

export default function Cart() {
    const { productIds, setProductIds, setBasketItems, basketItems } = useContext(StoreContext)
    const [basketData, setBasketData] = useState([])
    const history = useHistory()
    const API_URL = 'http://89.19.23.50:9006/api/v1'
    const ORDER_URL = 'http://89.19.23.50:9005'

    useEffect(()=>{
        getBasket()
    },basketItems)
    function getBasket(){
        axios.get(API_URL + `/basket`,
            {
                headers: authHeader()
            }
        ).then((data) => {
            setBasketData(oldArray => [...oldArray, data])
        })
    }


    const handleAmountChange = (index, value, basketItemId) => {
        axios.put(API_URL + `/basket-item/quantity-increment/${basketItemId}`,{
            basketItemId: basketItemId,
            quantity: value,
        } ,
        {
            headers: authHeader() 
        }
        ).then((data) => {
            setBasketData([data])
            getBasket()

        })
    }

    const handleDeleteItem = (index, basketItemId) => {
        axios.delete(API_URL + `/basket-item/${basketItemId}`,
            { 
                headers: authHeader() 
            }
            ).then((response) => {
            setProductIds(productIds.filter((_, i) => i !== index))
            setBasketItems(basketItems.filter((basket,i) => index !== i ))
            setBasketData([{data: response.data}])
            window.location.reload()
        })
    }

    const handleClearCart = (basketId) => {
        if(window.confirm("You're about to clear shopping cart. Is that okay?")) {
            axios.delete(API_URL + `/basket/${basketId}`,
            {
                headers: authHeader() 
            }
            )
            .then(() => {
                setBasketData([])
                setProductIds([])
                setBasketItems([])
                getBasket()
            })
        }
    }

    const paymentRequest = (basketData) => {
        axios.post(ORDER_URL + `/api/v1/orders/place-order` , {
            basketResponseDto:basketData,
            },
            {
                headers: authHeader() 
            }
            ).then(({ data }) => {
            history.push({
                pathname:'/paymentSuccess',
                state: { totalPrice: data.totalPrice}
            })
            setBasketData([])
            setProductIds([])
            setBasketItems([])
            getBasket()
        })
    }

    return (
        <>
        {
            basketData[0]?.data?.basketItemList?.length >0 ?
            <>
                <section className="py-12">
                    <div className="tw-container">
                        <article className="hidden lg:block py-10">
                            <div className="grid text-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
                                <h5>Item</h5>
                                <h5>Quantity</h5>
                                <h5>Price</h5>
                                <h5>Total Price</h5>
                                <span className="w-8 h-8"></span>
                            </div>
                            <hr className="mt-6"/>
                        </article>
                        {
                            basketData[0]?.data?.basketItemList?.map((item, index) => {
                                const { price, imgUrl, name, quantity, basketItemId, totalPrice } = item
                                return (
                                    <article key={index} className="grid cart-grid-cols-3 lg:cart-grid-cols-5 place-items-center mb-6 capitalize">
                                        <div className="flex w-full gap-2 md:gap-4 items-center">
                                            <img alt={name} className="object-cover w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md" src={imgUrl}/>
                                            <div>
                                                <h5 className="text-base md:text-lg lg:text-xl font-semibold">{name}</h5>
                                                <div className="lg:hidden">{(price)}</div>
                                            </div>
                                        </div>
                                        <Counter
                                            className="text-3xl md:text-4xl"
                                            count={quantity}
                                            maxNum={100}
                                            setCount={(value) => handleAmountChange(index, value, basketItemId)}
                                        />
                                        <h5 className="hidden lg:block">{(price)}</h5>
                                        <h5 className="hidden lg:block">{((price * quantity))}</h5>
                                        <button className="block ml-3 md:ml-0 w-7 h-7 p-2 bg-red-600 text-white rounded" onClick={() => handleDeleteItem(index, basketItemId)}>
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
                                        </button>
                                    </article>
                                )
                            })
                        }
                        <hr className="mt-10"/>
                        <div className="flex justify-between py-8">
                            <Link to="/" className="btn-sm w-max bg-blue-500 text-white text-bold">Continue Shopping</Link>
                            <button onClick={() => handleClearCart(basketData[0]?.data?.basketId)} className="btn-sm font-bold text-red-900 bg-red-300">Clear Cart</button>
                        </div>
                        <section className="flex justify-center lg:justify-end">
                            <div className="w-full md:w-auto">
                                <article className="md:border px-4 py-2 md:px-12 md:py-6">
                                    <hr className="my-4"/>
                                    <h4 className="flex justify-center gap-5" style={{ gridTemplateColumns: '200px 1fr' }}>
                                        Order Total:
                                        <span>{basketData[0]?.data?.totalPrice}</span>
                                    </h4>
                                </article>
                                    <button onClick={() => paymentRequest(basketData[0]?.data)} className='btn-sm bg-red-500 text-white text-bold mt-7 text-center'>
                                        Go to the payment screen
                                    </button>
                            </div>
                        </section>
                    </div>
                </section>
            </>
            :
            <div className="tw-container text-center py-20">
                <h2 className="font-bold">Your cart is empty</h2>
                <Link to="/" className="mt-5 btn-sm w-max mx-auto">Return to home</Link>
            </div>
        }
        </>
    )
}
