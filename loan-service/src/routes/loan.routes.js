const express = require('express');
const router = express.Router();
const loanService = require('../services/loanService');
const { validateLoan } = require('../middleware/validation');

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Obtenir tous les emprunts
 *     tags: [Loans]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste des emprunts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 */
router.get('/', async (req, res, next) => {
    try {
        const loans = await loanService.getAllLoans(req.query);
        res.json(loans);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Obtenir un emprunt par ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'emprunt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Emprunt non trouvé
 */
router.get('/:id', async (req, res, next) => {
    try {
        const loan = await loanService.getLoanById(req.params.id);
        res.json(loan);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/user/{userId}:
 *   get:
 *     summary: Obtenir les emprunts d'un utilisateur
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des emprunts de l'utilisateur
 */
router.get('/user/:userId', async (req, res, next) => {
    try {
        const loans = await loanService.getUserLoans(req.params.userId);
        res.json(loans);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/status/active:
 *   get:
 *     summary: Obtenir les emprunts actifs
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: Liste des emprunts actifs
 */
router.get('/status/active', async (req, res, next) => {
    try {
        const loans = await loanService.getActiveLoans();
        res.json(loans);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/status/overdue:
 *   get:
 *     summary: Obtenir les emprunts en retard
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: Liste des emprunts en retard
 */
router.get('/status/overdue', async (req, res, next) => {
    try {
        const loans = await loanService.getOverdueLoans();
        res.json(loans);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/statistics:
 *   get:
 *     summary: Obtenir les statistiques des emprunts
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: Statistiques des emprunts
 */
router.get('/statistics', async (req, res, next) => {
    try {
        const stats = await loanService.getLoanStatistics();
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/book/{bookId}/count:
 *   get:
 *     summary: Nombre d'emprunts pour un livre (Communication Sync avec Book Service)
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nombre d'emprunts
 */
router.get('/book/:bookId/count', async (req, res, next) => {
    try {
        const count = await loanService.getLoanCountByBookId(parseInt(req.params.bookId));
        res.json(count);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Créer un nouvel emprunt
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - userId
 *               - userName
 *             properties:
 *               bookId:
 *                 type: number
 *               userId:
 *                 type: string
 *               userName:
 *                 type: string
 *               userEmail:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Emprunt créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', validateLoan, async (req, res, next) => {
    try {
        const loan = await loanService.createLoan(req.body);
        res.status(201).json(loan);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/{id}/return:
 *   put:
 *     summary: Retourner un livre emprunté
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre retourné avec succès
 *       404:
 *         description: Emprunt non trouvé
 */
router.put('/:id/return', async (req, res, next) => {
    try {
        const loan = await loanService.returnLoan(req.params.id);
        res.json(loan);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/{id}/renew:
 *   put:
 *     summary: Renouveler un emprunt
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Emprunt renouvelé avec succès
 *       400:
 *         description: Impossible de renouveler
 */
router.put('/:id/renew', async (req, res, next) => {
    try {
        const loan = await loanService.renewLoan(req.params.id);
        res.json(loan);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /loans/check-overdue:
 *   post:
 *     summary: Vérifier et mettre à jour les emprunts en retard
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: Vérification effectuée
 */
router.post('/check-overdue', async (req, res, next) => {
    try {
        const overdueLoans = await loanService.checkOverdueLoans();
        res.json({ 
            message: 'Overdue check completed',
            count: overdueLoans.length,
            loans: overdueLoans
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
