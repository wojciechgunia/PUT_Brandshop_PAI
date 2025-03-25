package pl.put.brandshop.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.put.brandshop.product.entity.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>
{
    Optional<Category> findByShortId(String shortId);

    Optional<Category> findByName(String name);

    List<Category> findAllByActivate(Boolean activate);
}
