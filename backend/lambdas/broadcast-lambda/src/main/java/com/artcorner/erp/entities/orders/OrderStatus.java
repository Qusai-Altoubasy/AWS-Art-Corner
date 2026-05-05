package com.artcorner.erp.entities.orders;

import java.util.Set;

public enum OrderStatus {

    PENDING {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(ACCEPTED, CANCELED);
        }
    },
    CANCELED {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(PENDING);
        }
    },
    ACCEPTED {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(PROCESSING);
        }
    },
    PROCESSING {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(READY);
        }
    },
    READY {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(DELIVERING, COMPLETED);
        }
    },
    DELIVERING {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of(COMPLETED);
        }
    },
    COMPLETED {
        @Override
        public Set<OrderStatus> allowedTransitions() {
            return Set.of();
        }
    };

    public abstract Set<OrderStatus> allowedTransitions();

    public boolean canTransitionTo(OrderStatus newStatus) {
        return allowedTransitions().contains(newStatus);
    }
}