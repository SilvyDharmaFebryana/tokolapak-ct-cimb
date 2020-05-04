const init_state = {
    searchInput: ""
};

export default (state = init_state, action) => {
    if (action.type === "ON_CHANGE_SEARCH_INPUT") {
        return { ...state, searchInput: action.payload };
    } else {
        return { ...state };
    }
    
};

