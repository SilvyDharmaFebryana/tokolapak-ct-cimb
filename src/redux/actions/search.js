export const searchInputHandler = (text) => {
    return {
        type: "ON_CHANGE_SEARCH_INPUT",
        payload: text,
    };
};

