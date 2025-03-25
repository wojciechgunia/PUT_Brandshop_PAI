package pl.put.brandshop.product.translator;

import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import pl.put.brandshop.product.entity.Category;
import pl.put.brandshop.product.entity.CategoryDTO;

@Mapper
public abstract class CategoryToCategoryDTO
{
    public CategoryDTO toCategoryDTO(Category category)
    {
        return toDTO(category);
    }

    @Mappings({})
    protected abstract CategoryDTO toDTO(Category category);
}
