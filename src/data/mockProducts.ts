import { StaticImageData } from "next/image";
import goldCoinEagle from '@/assets/mocks/coin.png';
import oneOz from '@/assets/mocks/1-oz.png';
import tenOz from '@/assets/mocks/10-oz.png';
import oneKilo from '@/assets/mocks/1-kg.png';

// Define the type for a single product, matching your ProductCard props
export interface Product {
    id: number;
    name: string;
    weight: string;
    price: string;
    purity: string;
    image: StaticImageData;
    category: "Bar" | "Coin" | "Jewelry";
}

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "1 oz PAMP Suisse Gold Bar",
        weight: "1 oz t",
        price: "$2,689.50",
        purity: "99.99%",
        image: oneOz,
        category: "Bar",
    },
    {
        id: 2,
        name: "American Gold Eagle Coin",
        weight: "1 oz t",
        price: "$2,795.00",
        purity: "91.67%",
        image: goldCoinEagle,
        category: "Coin",
    },
    {
        id: 3,
        name: "10 oz Valcambi Gold Bar",
        weight: "10 oz t",
        price: "$26,450.00",
        purity: "99.99%",
        image: tenOz,
        category: "Bar",
    },
    {
        id: 4,
        name: "Canadian Maple Leaf Coin",
        weight: "1 oz t",
        price: "$2,750.00",
        purity: "99.99%",
        image: goldCoinEagle,
        category: "Coin",
    },
    {
        id: 5,
        name: "1 kg Perth Mint Gold Bar",
        weight: "32.15 oz t",
        price: "$84,750.00",
        purity: "99.99%",
        image: oneKilo,
        category: "Bar",
    },
    {
        id: 6,
        name: "British Gold Sovereign",
        weight: "0.2354 oz t",
        price: "$625.00",
        purity: "91.67%",
        image: goldCoinEagle,
        category: "Coin",
    },
    {
        id: 7,
        name: "50g Gold CombiBar",
        weight: "1.607 oz t",
        price: "$4,300.00",
        purity: "99.99%",
        image: oneOz,
        category: "Bar",
    },
    {
        id: 8,
        name: "South African Krugerrand",
        weight: "1 oz t",
        price: "$2,730.00",
        purity: "91.67%",
        image: goldCoinEagle,
        category: "Coin",
    },

    // ---- New Items ----

    {
        id: 9,
        name: "Credit Suisse 5g Gold Bar",
        weight: "0.1607 oz t",
        price: "$340.00",
        purity: "99.99%",
        image: oneOz, // placeholder
        category: "Bar",
    },
    {
        id: 10,
        name: "Austrian Philharmonic Gold Coin",
        weight: "1 oz t",
        price: "$2,760.00",
        purity: "99.99%",
        image: goldCoinEagle, // placeholder
        category: "Coin",
    },
    {
        id: 11,
        name: "Royal Mint 100g Gold Bar",
        weight: "3.215 oz t",
        price: "$8,450.00",
        purity: "99.99%",
        image: tenOz, // placeholder
        category: "Bar",
    },
    {
        id: 12,
        name: "24k Gold Rope Chain Necklace",
        weight: "0.5 oz t",
        price: "$1,480.00",
        purity: "99.99%",
        image: oneOz, // placeholder
        category: "Jewelry",
    },
];
