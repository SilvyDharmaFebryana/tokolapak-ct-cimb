const init_state = {
    quantityItem: ""
};

export default (state = init_state, action) => {
    if (action.type === "GET_QUANTITY") {
        return { ...state, quantityItem: action.payload };
    } else {
        return { ...state };
    }

};
