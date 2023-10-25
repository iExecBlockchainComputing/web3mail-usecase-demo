export const grantAccess = async ({
  iexec,
  protectedData,
  authorizedApp,
  authorizedUser,
  pricePerAccess,
  numberOfAccess,
}: any): Promise<any> => {
  const datasetorder = await iexec.order.createDatasetorder({
    dataset: protectedData,
    apprestrict: authorizedApp,
    requesterrestrict: authorizedUser,
    datasetprice: pricePerAccess,
    volume: numberOfAccess,
    tag: ['scone', 'tee'],
  });
  await iexec.order.signDatasetorder(datasetorder);
  await iexec.order.publishDatasetorder(datasetorder);
  return formatGrantedAccess(datasetorder);
};

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
