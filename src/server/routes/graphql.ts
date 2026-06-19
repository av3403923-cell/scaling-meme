import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { graphQLService } from '../services/GraphQLService';
import logger from '../utils/logger';

const router = Router();

router.get('/', (req: AuthRequest, res) => {
  try {
    const queries = graphQLService.getQueries(req.userId!);
    res.json({ success: true, data: queries });
  } catch (error) {
    logger.error('Get GraphQL queries error:', error);
    res.status(500).json({ error: 'Failed to fetch GraphQL queries' });
  }
});

router.get('/:id', (req: AuthRequest, res) => {
  try {
    const query = graphQLService.getQuery(req.params.id, req.userId!);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    res.json({ success: true, data: query });
  } catch (error) {
    logger.error('Get GraphQL query error:', error);
    res.status(500).json({ error: 'Failed to fetch GraphQL query' });
  }
});

router.delete('/:id', (req: AuthRequest, res) => {
  try {
    const success = graphQLService.deleteQuery(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Query not found' });
    }
    res.json({ success: true, message: 'Query deleted' });
  } catch (error) {
    logger.error('Delete GraphQL query error:', error);
    res.status(500).json({ error: 'Failed to delete query' });
  }
});

export default router;