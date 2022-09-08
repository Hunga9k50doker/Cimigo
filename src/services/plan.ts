import { API } from 'config/constans';
import { UserGetPlans } from 'models/plan';
import { UserGetSolutionCategories, UserGetSolutions } from 'models/solution';
import api from 'services/configApi';

export class PlanService {
    static async getPlans(data: UserGetPlans): Promise<any> {
        return await api.get(API.PLAN.DEFAULT, {
            params: data
        })
        .then((res) => {
        return Promise.resolve(res.data)
        })
        .catch((e) => {
        return Promise.reject(e?.response?.data);
        })
    }
}