import { api } from '@/lib/api';
import { Food } from '@/types/food';

export async function getFoods(search?: string) {
  const response = await api.get<Food[]>('/foods', {
    params: search ? { search } : {},
  });
  return response.data;
}

export async function getFavoriteFoods() {
  const response = await api.get<Food[]>('/foods/favorites');
  return response.data;
}

export async function getAllFoods(search: string) {
  const response = await api.get<Food[]>('/foods/all', {
    params: { search },
  });
  return response.data;
}

export async function createFood(
  food: Omit<Food, 'id'>,
) {
  const response = await api.post('/foods', food);
  return response.data;
}

export async function searchFoods(search: string) {
  const response = await api.get('/foods/suggest', {
    params: { q: search },
  });
  return response.data;
}

export async function updateFood(
  id: string,
  food: Partial<Omit<Food, 'id'>>,
) {
  const response = await api.put(`/foods/${id}`, food);
  return response.data;
}

export async function deleteFood(id: string) {
  const response = await api.delete(`/foods/${id}`);
  return response.data;
}