import axios from "axios";

const Api = axios.create({
    baseURL: process.env['REACT_APP_BACKEND_URL'] || "https://localhost:5000", withCredentials: true,
    headers: {
        "Access-Control-Allow-Credentials": "true",
    }
});

const token = localStorage.getItem('token');



const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

// =========================== Authentication APIS ============================== //
export const registerUserApi = (data) => Api.post('/api/user/create', data)

export const loginUserApi = (data) => Api.post('/api/user/login', data)
export const verifyOtpApi = (data) => Api.post('/api/user/verify-otp', data)


// =========================== Product APIS ============================== //
export const getPopularProductsApi = () => Api.get('/api/product/get-popular-products')

export const getNewProductsApi = () => Api.get('/api/product/get-all')

export const getProductsApi = () => Api.get('/api/product/get-all')

export const createProductApi = (data) => Api.post('/api/product/create', data);

export const deleteProductApi = (id) => Api.delete(`/api/product/delete/${id}`);

export const getProductApi = (id) => Api.get(`/api/product/get/${id}`);

export const updateProductApi = (id, data) => Api.patch(`/api/product/update/${id}`, data);

export const getProductsByCategoryApi = (category) => Api.get(`/api/product/get-all/category/${category}`);

export const searchProductsApi = (keyword) => Api.get(`/api/product/get-all?keyword=${keyword}`);


// =========================== Cart APIS ============================== //
export const addItemToCartApi = (data) => Api.post(`/api/cart/add`, data, config)
export const getItemsFromCartApi = () => Api.get(`/api/cart/get-all`, config)
export const removeItemFromCartApi = (id) => Api.delete(`/api/cart/remove/${id}`, config)
export const removeItemsFromCartApi = () => Api.delete(`/api/cart/remove`, config)


// =========================== Order APIS ============================== //
export const createOrderApi = (data) => Api.post(`/api/order/create`, data, config)
export const getOrderApi = (id) => Api.get(`/api/order/get/${id}`, config)
export const getOrdersApi = () => Api.get(`/api/order/get-all`, config)
export const getAllOrdersApi = () => Api.get(`/api/order/admin/get-all`, config)
export const updateOrderStatusApi = (id, status) => Api.patch(`/api/order/update/${id}/${status}`, {}, config)


// =========================== User APIS ============================== //
export const updateUserApi = (data) => {
    return Api.patch('/api/user/update/me', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        }
    });
};
export const changePasswordApi = (data) => Api.patch(`/api/user/change-password`, data, config)
export const getUsersApi = () => Api.get(`/api/user/admin/get-all`, config)
export const deleteUserApi = (id) => Api.delete(`/api/user/admin/${id}`, config)


// =========================== Khalti APIS ============================== //

export const khaltiApi = (data) =>
  axios.post(`https://localhost:5000/api/payment/khalti`, data);

