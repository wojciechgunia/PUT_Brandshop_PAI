package pl.put.brandshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.put.brandshop.order.entity.Deliver;
import pl.put.brandshop.order.entity.Payment;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>
{
    Optional<Payment> findByUuid(String uuid);
}
