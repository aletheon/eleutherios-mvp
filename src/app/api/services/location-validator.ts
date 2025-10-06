// // /api/services/location-validator
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { customerLocation, serviceRadius, serviceLocation } = req.body;
  
//   const distance = calculateDistance(customerLocation, serviceLocation);
//   const withinRadius = distance <= serviceRadius;
  
//   res.json({
//     success: withinRadius,
//     data: { 
//       distance,
//       maxDistance: serviceRadius,
//       withinRadius 
//     },
//     message: withinRadius 
//       ? "Location valid for delivery" 
//       : `Outside delivery area (${distance}km away, max ${serviceRadius}km)`
//   });
// }