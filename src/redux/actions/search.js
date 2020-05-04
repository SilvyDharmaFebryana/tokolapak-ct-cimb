export const searchInputHandler = (text) => {
    
    return {
        type: "ON_CHANGE_SEARCH_INPUT",
        payload: text,
    };
};

export const searchNavbarInputHandler = (e) => {

    const { value } = e.target

    return {
        type: "ON_CHANGE_SEARCH_INPUT_NAVBAR",
        payload: value,
    };
};

