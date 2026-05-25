// ========================================
// PREORDER UTILS
// VEZBERRY
// ========================================

// ========================================
// GET READY DATE OBJECT
// ========================================

export const getReadyDateObject = (
  days = 0
) => {

  const totalDays =
    Number(days || 0);

  const date =
    new Date();

  date.setDate(
    date.getDate() +
    totalDays
  );

  return date;

};

// ========================================
// GET READY DATE STRING
// YYYY-MM-DD
// ========================================

export const getReadyDate = (
  days = 0
) => {

  return getReadyDateObject(
    days
  )
    .toISOString()
    .split("T")[0];

};

// ========================================
// FORMAT ESTIMATED DATE
// ========================================

export const formatEstimatedDate = (
  days = 0,
  locale = "id-ID"
) => {

  return getReadyDateObject(
    days
  ).toLocaleDateString(
    locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

};

// ========================================
// SHORT DATE
// ========================================

export const formatShortEstimatedDate = (
  days = 0,
  locale = "id-ID"
) => {

  return getReadyDateObject(
    days
  ).toLocaleDateString(
    locale,
    {
      day: "2-digit",
      month: "short",
    }
  );

};

// ========================================
// PREORDER BADGE
// ========================================

export const getPreorderBadgeText = (
  days = 0
) => {

  const totalDays =
    Number(days || 0);

  if (totalDays <= 0) {

    return "PREORDER";

  }

  return `PREORDER H-${totalDays}`;

};

// ========================================
// ESTIMATION TEXT
// ========================================

export const getPreorderEstimationText = (
  days = 0
) => {

  const totalDays =
    Number(days || 0);

  return `Tersedia sekitar ${formatEstimatedDate(
    totalDays
  )} (${totalDays} hari dari order)`;

};

// ========================================
// CAPACITY LIMIT
// ========================================

export const calculateCapacityLimit = (
  capacity = 0,
  tolerancePercent = 10
) => {

  const totalCapacity =
    Number(capacity || 0);

  const tolerance =
    Number(
      tolerancePercent || 0
    );

  return Math.ceil(

    totalCapacity *

    (
      1 +
      tolerance / 100
    )

  );

};

// ========================================
// CHECK PREORDER CLOSED
// ========================================

export const isPreorderClosed = (

  orderedQty = 0,

  capacity = 0,

  tolerancePercent = 10

) => {

  const limit =
    calculateCapacityLimit(
      capacity,
      tolerancePercent
    );

  return Number(
    orderedQty || 0
  ) >= limit;

};

// ========================================
// COUNT PRODUCT ORDER
// ========================================

export const countProductOrders = (

  productId,

  orders = [],

  readyAfterDays = 0

) => {

  const targetDate =
    getReadyDate(
      readyAfterDays
    );

  let total = 0;

  orders.forEach(order => {

    (
      order.items || []
    ).forEach(item => {

      const sameProduct =

        item.id ===
        productId;

      const sameDate =

        getReadyDate(
          item.ready_after_days
        ) === targetDate;

      if (
        sameProduct &&
        sameDate
      ) {

        total += Number(
          item.quantity || 0
        );

      }

    });

  });

  return total;

};

// ========================================
// APPLY PREORDER LOGIC
// ========================================

export const applyPreorderCapacityLogic = (

  products = [],

  orders = [],

  tolerancePercent = 10

) => {

  if (
    !Array.isArray(products)
  ) {

    return [];

  }

  return products.map(
    product => {

      // NOT PREORDER

      if (
        !product.is_preorder
      ) {

        return product;

      }

      const totalOrdered =

        countProductOrders(

          product.id,

          orders,

          product.ready_after_days

        );

      const capacity =
        Number(
          product.daily_capacity || 0
        );

      const preorderClosed =

        capacity > 0

          ? isPreorderClosed(

            totalOrdered,

            capacity,

            tolerancePercent

          )

          : false;

      return {

        ...product,

        preorder_closed:
          preorderClosed,

        total_ordered_today:
          totalOrdered,

        capacity_limit:
          calculateCapacityLimit(
            capacity,
            tolerancePercent
          ),

      };

    }
  );

};

// ========================================
// GET PREORDER STATUS
// ========================================

export const getPreorderStatus = (
  product
) => {

  if (!product) {

    return {
      isClosed: false,
      label: "",
    };

  }

  // CLOSED

  if (
    product.preorder_closed
  ) {

    return {

      isClosed: true,

      label:
        "PO DITUTUP",

    };

  }

  // ACTIVE

  if (
    product.is_preorder
  ) {

    return {

      isClosed: false,

      label:
        getPreorderBadgeText(
          product.ready_after_days
        ),

    };

  }

  return {

    isClosed: false,

    label: "",

  };

};

// ========================================
// BUILD WA PREORDER TEXT
// ========================================

export const buildPreorderWhatsAppText = (
  item
) => {

  if (
    !item?.is_preorder
  ) {

    return "";

  }

  const days =
    Number(
      item.ready_after_days || 0
    );

  return `

⏰ ${getPreorderBadgeText(days)}

📅 Estimasi tersedia:
${formatEstimatedDate(days)}

`;

};

// ========================================
// GENERATE PRODUCTION GROUP
// ========================================

export const generateProductionGroups = (
  orders = []
) => {

  const grouped = {};

  orders.forEach(order => {

    (
      order.items || []
    ).forEach(item => {

      if (
        !item.is_preorder
      ) return;

      const readyDate =
        getReadyDate(
          item.ready_after_days
        );

      if (
        !grouped[readyDate]
      ) {

        grouped[readyDate] = [];

      }

      grouped[readyDate].push({

        product_id:
          item.id,

        product_name:
          item.product_name ||
          item.name,

        quantity:
          item.quantity,

      });

    });

  });

  return grouped;

};

// ========================================
// EXPORT DEFAULT
// ========================================

export default {

  getReadyDateObject,

  getReadyDate,

  formatEstimatedDate,

  formatShortEstimatedDate,

  getPreorderBadgeText,

  getPreorderEstimationText,

  calculateCapacityLimit,

  isPreorderClosed,

  countProductOrders,

  applyPreorderCapacityLogic,

  getPreorderStatus,

  buildPreorderWhatsAppText,

  generateProductionGroups,

};