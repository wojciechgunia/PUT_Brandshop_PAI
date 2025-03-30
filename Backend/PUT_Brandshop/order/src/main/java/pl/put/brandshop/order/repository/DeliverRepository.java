package pl.put.brandshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.put.brandshop.order.entity.Deliver;

import java.util.Optional;

public interface DeliverRepository extends JpaRepository<Deliver, Long>
{
    Optional<Deliver> findByUuid(String uuid);
}
