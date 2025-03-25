package pl.put.brandshop.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.put.brandshop.product.entity.ProductEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>
{
    @Query(nativeQuery = true, value = "SELECT count(*) FROM products WHERE activate is TRUE")
    long countActiveProducts();

    List<ProductEntity> findByNameAndCreateAt(String name, LocalDate date);

    Optional<ProductEntity> findByUid(String uid);
}
