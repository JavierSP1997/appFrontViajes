import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import type { Review } from "../../../interfaces/review.interface";

@Injectable({
	providedIn: "root",
})
export class ReviewService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/reviews";

	getAll() {
		return lastValueFrom(this.httpClient.get<Review[]>(`${this.baseUrl}`));
	}

	getByViajeId(viajeId: number) {
		return lastValueFrom(
			this.httpClient.get<Review[]>(`${this.baseUrl}/viaje/${viajeId}/usuario`),
		);
	}

	createReview(body: Review) {
		const token = localStorage.getItem("token");
		return lastValueFrom(
			this.httpClient.post<Review>(`${this.baseUrl}`, body, {
				headers: {
					Authorization: token ?? "",
				},
			}),
		);
	}

	updateReview(id: number, body: Review) {
		const token = localStorage.getItem("token");
		return lastValueFrom(
			this.httpClient.put<Review>(`${this.baseUrl}/${id}`, body, {
				headers: {
					Authorization: token ?? "",
				},
			}),
		);
	}

	deleteReview(id: number) {
		const token = localStorage.getItem("token");
		return lastValueFrom(
			this.httpClient.delete(`${this.baseUrl}/${id}`, {
				headers: {
					Authorization: token ?? "",
				},
			}),
		);
	}
}
