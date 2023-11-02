export const grantAccess = async ({
  iexec,
  protectedData,
  authorizedApp,
  authorizedUser,
  pricePerAccess,
  numberOfAccess,
}: any): Promise<any> => {
  try {
    const { orders } = await iexec.orderbook.fetchDatasetOrderbook(
      protectedData,
      {
        app: authorizedApp,
        requester: authorizedUser,
      }
    );

    if (orders.length > 0) {
      throw new Error(
        'An access has already been granted to this user with this app'
      );
    }

    const datasetorderTemplate = await iexec.order.createDatasetorder({
      dataset: protectedData,
      apprestrict: authorizedApp,
      requesterrestrict: authorizedUser,
      datasetprice: pricePerAccess,
      volume: numberOfAccess,
      tag: ['tee', 'scone'],
    });

    const datasetorder = await iexec.order.signDatasetorder(
      datasetorderTemplate
    );

    await iexec.order.publishDatasetorder(datasetorder);

    return formatGrantedAccess(datasetorder);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to grant access');
  }
};

// Duplicated from dataprotector-sdk
export const formatGrantedAccess = (order: {
  datasetprice: number | string;
  volume: number | string;
  tag: string;
  apprestrict: string;
  workerpoolrestrict: string;
  requesterrestrict: string;
  salt: string;
  sign: string;
}): any =>
  Object.fromEntries(
    Object.entries(order).map(([key, val]) => [
      key,
      val.toString().toLowerCase(),
    ]) // stringify numbers and lowercase addresses to return a clean GrantedAccess
  ) as any;
