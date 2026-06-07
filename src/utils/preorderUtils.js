export const getPreorderReadyDate = (
    product
) => {

    if (
        !product?.is_preorder ||
        !product?.ready_after_days
    ) {
        return null;
    }

    const date = new Date();

    date.setDate(
        date.getDate() +
        Number(product.ready_after_days)
    );

    return date;
};

export const formatPreorderDate = (
    product
) => {

    const date =
        getPreorderReadyDate(product);

    if (!date) return '';

    return date.toLocaleDateString(
        'id-ID',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
    );

};