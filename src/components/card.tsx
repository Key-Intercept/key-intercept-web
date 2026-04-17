import React, { type ReactNode } from 'react';
import '../style/card.css';

interface CardProps {
    title: string;
    children?: ReactNode;
}

export default function Card({ title, children }: CardProps) {
    return (
        <div className="card-positioner">
            <div className="card-container">
                <div className="card-title">
                    {title}
                </div>
                {children}
            </div>
        </div>
    );
}
