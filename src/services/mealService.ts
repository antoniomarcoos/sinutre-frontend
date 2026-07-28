import { api } from '@/lib/api';

export async function createMeal(
  meal: {
    type: string;
    eatTime: string;
    description?: string;
    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.post('/meals', meal);
}

export async function updateMeal(
  id: string,
  meal: {
    type: string;
    eatTime: string;
    description?: string;
    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.put(`/meals/${id}`, meal);
}