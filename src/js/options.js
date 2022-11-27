/**
 * @param options {Object}
 */

export default (options) => {
    const defaultOptions = {
        container: document.getElementsByClassName("board")[0]
    };

    for (const optionsKey in defaultOptions) {
        if (options[optionsKey] === undefined) {
            options[optionsKey] = defaultOptions[optionsKey];
        }
    }

    if (!(options.container instanceof HTMLElement)) {
        options.container = defaultOptions.container;
    }
    return options;
};
