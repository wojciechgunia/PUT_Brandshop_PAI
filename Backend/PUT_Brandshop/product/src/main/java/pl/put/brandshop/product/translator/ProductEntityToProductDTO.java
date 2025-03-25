package pl.put.brandshop.product.translator;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.product.entity.Category;
import pl.put.brandshop.product.entity.CategoryDTO;
import pl.put.brandshop.product.entity.ProductDTO;
import pl.put.brandshop.product.entity.ProductEntity;

@Mapper
public abstract class ProductEntityToProductDTO
{
    public ProductDTO toProductDTO(ProductEntity productEntity)
    {
        return toDTO(productEntity);
    }

    @Mappings({
            @Mapping(target = "categoryDTO", expression = "java(toCategoryDTO(productEntity.getCategory()))")
    })
    protected abstract ProductDTO toDTO(ProductEntity productEntity);

    @Mappings({})
    protected abstract CategoryDTO toCategoryDTO(Category category);

}
