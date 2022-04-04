import * as service from './booking.service';
import generatePdf from '../../utils/generatePDF';

export const getBookingsList = async (request, response, next) => {
  try {
    const result = await service.getBookingsList(
      {
        user: request.user,
        limit: parseInt(request.query.limit as string, 10),
        skip: parseInt(request.query.skip as string, 10),
      },
    );

    response.status(200).send(result);
  } catch (e) {
    next(e);
  }
};

export const postBooking = async (request, response, next) => {
  try {
    const result = await service.createBooking({
      requestBody: request.body,
    });
    response.status(201).send(result);
  } catch (e) {
    next(e);
  }
};

export const deleteBooking = async (request, response, next) => {
  try {
    const result = await service.deleteBooking({
      id: request.params.id,
    });
    response.status(202).send(result);
  } catch (e) {
    next(e);
  }
};

export const getBooking = async (request, response, next) => {
  try {
    const result = await service.getBooking({
      id: request.params.id,
    });

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-disposition', 'attachment; filename=ticket.pdf');
    response.status(200).send(await generatePdf(result));
  } catch (e) {
    next(e);
  }
};
