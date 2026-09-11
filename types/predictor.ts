interface FilterOption {
    show: boolean;
    required: boolean;
}

interface Filter {
    category: FilterOption;
    quota: FilterOption;
    branch: FilterOption;
    year: FilterOption;
    round: FilterOption;
    count: number;
}

interface PredictorSchema {
    _id: string; // Required _id property
    icon: string;
    name: string;
    features?: string[];
    video?: string;
    notFoundVideo?: string;
    description?: string;
    data: any;
    counselling?: string;
    exams?: string[];
    course?: string;
    discountedPrice?: number;
    originalPrice?: number;
    amount: number;
    price: number;
    tool?: string;
    averageRating?: number;
    ratingCount?: number;
    totalRatings?: number;

    categories?: string[];
    quotas?: string[];
    branches?: string[];
    years?: string[];
    rounds?: string[];
    seats?: string[];
    boards?: string[];
    domiciles?: string[];


    filter: Filter;

    created: string;
    updated: string;
    archive: boolean;
}
